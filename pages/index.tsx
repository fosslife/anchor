import {
  Badge,
  Box,
  Button,
  createStyles,
  Grid,
  Group,
  Image,
  MediaQuery,
  Modal,
  MultiSelect,
  Navbar,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import axios from "axios";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { FormEventHandler, useState } from "react";

const useStyles = createStyles((theme, params, getRef) => ({
  navbarContainer: {
    // padding: 10,
    // paddingInline: 20,
    height: "64px",
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 1px 8px 0px",
  },
  card: {
    width: "40vw",
    // // minWidth: "400px",
    // overflow: "hidden",
    // textOverflow: "ellipsis",
    boxShadow: theme.shadows.sm,
    borderRadius: 4,
    background: theme.colors.dark,
    // height: 80,
  },
  cardImage: {
    background: "white",
    height: "110px",
    width: 72,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
}));

const Home: NextPage = ({ prevLink, prevTags }: any) => {
  const { classes } = useStyles();

  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [searchTags, setSearchTags] = useState(prevTags);
  const [links, setLinks] = useState(prevLink);
  const [opened, setOpened] = useState(false);

  const matches = useMediaQuery("(min-width: 400px)");
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    await axios.post("/api/link", { title, link, tags });
    // console.log(res.data);
  };

  return (
    <div>
      <Navbar className={classes.navbarContainer}>
        <Group position="apart" align={"center"} p={"md"}>
          <MediaQuery smallerThan={"sm"} styles={{ display: "none" }}>
            <Navbar.Section>
              <Text variant="gradient" size="xl" weight={700}>
                ANCHOR
              </Text>
            </Navbar.Section>
          </MediaQuery>
          <Navbar.Section>
            <TextInput
              style={{ minWidth: "40vw" }}
              placeholder="Search..."
              onChange={(e) => {
                console.log(router);
                router.query.q = e.target.value;
                router.push(router);
              }}
            ></TextInput>
          </Navbar.Section>
          <Navbar.Section>
            <Button
              variant="light"
              radius={"md"}
              onClick={() => setOpened(true)}
            >
              +
            </Button>
          </Navbar.Section>
        </Group>
      </Navbar>

      {/* MODAL */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Add New Link"
      >
        <form onSubmit={handleSubmit}>
          <TextInput
            onChange={(e) => setLink(e.target.value)}
            required
            placeholder="Enter Link"
            label="Link"
            mt="md"
          ></TextInput>
          <TextInput
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Title"
            label="Title"
            mt="md"
          ></TextInput>
          <MultiSelect
            mt="md"
            data={searchTags}
            placeholder="Select tags"
            label="tags"
            limit={10}
            maxSelectedValues={4}
            searchable
            clearable
            creatable
            getCreateLabel={(e) => `+ Create New Tag '${e}'`}
            onChange={(e) => setTags(e)}
            onCreate={(e) => {
              axios.post("/api/tags", { tag: e });
            }}
            onSearchChange={async (e) => {
              let { data } = await axios.get("/api/tags", {
                params: { q: e },
              });
              setSearchTags(data);
            }}
          />
          <Button type="submit" fullWidth mt="xl">
            Save
          </Button>
        </form>
      </Modal>
      {/*  */}

      {/* Body */}
      <Stack p="xl" align={"center"}>
        {links.map((l: any, i: number) => (
          // A CARD
          <Group className={classes.card} key={i} mt={10}>
            <Group
              id="1"
              align={"center"}
              position="center"
              className={classes.cardImage}
              mr={10}
            >
              <Image width={34} height={34} src={l.logo} alt="logo" />
            </Group>
            <Stack spacing={4}>
              <Text
                variant="link"
                component="a"
                href={l.link}
                size={"xl"}
                target="_blank"
              >
                {l.title} - {l.link}
              </Text>
              {/* TODO: maybe add description */}
              <Group mt={25}>
                {l.tags.split(",").map((e: string, i: number) => (
                  <Badge variant="filled" key={i}>
                    {e}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Group>
        ))}
      </Stack>
    </div>
  );
};

export async function getServerSideProps() {
  const searchTags = await axios.get("http://localhost:3000/api/tags");

  const links = await axios.get("http://localhost:3000/api/link");
  // console.log(links.data.data);
  return {
    props: { prevLink: links.data.data, prevTags: searchTags.data },
  };
}

export default Home;

import {
  Box,
  Button,
  createStyles,
  Modal,
  MultiSelect,
  Navbar,
  Text,
  TextInput,
} from "@mantine/core";
import axios from "axios";
import type { NextPage } from "next";
import { useEffect } from "react";
import { FormEventHandler, useState } from "react";

const useStyles = createStyles({
  navbarContainer: {
    padding: 10,
    paddingInline: 20,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    height: "64px",
    boxShadow: "rgba(99, 99, 99, 0.2) 0px 1px 8px 0px",
  },
  input: {
    width: "500px",
  },
});

const Home: NextPage = (props) => {
  const { classes } = useStyles();

  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [searchTags, setSearchTags] = useState([]);
  const [opened, setOpened] = useState(false);

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const res = await axios.post("/api/link", { title, link, tags });
    console.log(res.data);
  };

  useEffect(() => {
    axios.get("/api/tags").then(({ data }) => {
      setSearchTags(data);
    });
  }, []);

  return (
    <div>
      <Navbar className={classes.navbarContainer}>
        <Navbar.Section>
          <Text variant="gradient" size="xl" weight={700}>
            ANCHOR
          </Text>
        </Navbar.Section>
        <Navbar.Section>
          <TextInput
            className={classes.input}
            placeholder="Search..."
          ></TextInput>
        </Navbar.Section>
        <Navbar.Section>
          <Button variant="light" radius={"md"} onClick={() => setOpened(true)}>
            +
          </Button>
        </Navbar.Section>
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
            getCreateLabel={(e) => `+ Create New Tag \`${e}\``}
            onCreate={(e) => {
              console.log("e", e);
              axios.post("/api/tags", { tag: e });
            }}
            onSearchChange={async (e) => {
              let { data } = await axios.get("/api/tags", {
                params: { q: e },
              });
              setSearchTags(data);
            }}
            // onChange
          />
          <Button type="submit" fullWidth mt="xl">
            Save
          </Button>
        </form>
      </Modal>

      {/*  */}
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Home;

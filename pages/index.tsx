import {
  Box,
  Button,
  createStyles,
  MultiSelect,
  Navbar,
  Text,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useModals } from "@mantine/modals";
import type { NextPage } from "next";
import { FormEventHandler, useState } from "react";
import { db } from "../utils/db";

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
  const modals = useModals();

  const [link, setLink] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    // modals.closeModal(id);
    console.log("Submit", link, title, tags);
  };

  const openAddModal = () => {
    const id = modals.openModal({
      title: "Add new link",
      children: (
        <form onSubmit={handleSubmit}>
          <TextInput
            onChange={(e) => {
              console.log(e.target.value);
              setLink(e.target.value);
            }}
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
            data={[]}
            placeholder="Select tags"
            label="tags"
            maxSelectedValues={4}
            searchable
            clearable
            creatable
            getCreateLabel={(e) => `+ New Tag ${e}`}
            onChange={(e) => {
              // TODO: store in db
              setTags(e);
            }}
          />
          <Button
            type="submit"
            fullWidth
            mt="xl"
            onClick={() => {
              modals.closeModal(id);
              console.log("Click", link, title, tags);
            }}
          >
            Save
          </Button>
        </form>
      ),
    });
  };
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
          <Button variant="light" radius={"md"} onClick={openAddModal}>
            +
          </Button>
        </Navbar.Section>
      </Navbar>
    </div>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default Home;

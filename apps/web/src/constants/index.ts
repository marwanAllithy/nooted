import { BlockType } from "@/types";

const autoCompleteTerms = [
  {
    title: "text",
    description: "Text block",
  },
  {
    title: "H1",
    description: "Heading 1",
  },
  {
    title: "H2",
    description: "Heading 2",
  },
  {
    title: "H3",
    description: "Heading 3",
  },
  {
    title: "H4",
    description: "Heading 4",
  },
  {
    title: "H5",
    description: "Heading 5",
  },
  {
    title: "H6",
    description: "Heading 6",
  },
];

const headerTypes = [
  BlockType.H1,
  BlockType.H2,
  BlockType.H3,
  BlockType.H4,
  BlockType.H5,
  BlockType.H6,
];

const validSytax = ["#", "##", "###", "####", "#####", "######", "-"];

export { autoCompleteTerms, headerTypes, validSytax };

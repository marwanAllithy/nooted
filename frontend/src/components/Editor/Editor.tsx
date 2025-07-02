import Block from "@/lib/Editor/Block";
import Editor from "@/lib/Editor/Editor";
import { BlockType } from "@/types/editor";
import { useState, useRef } from "react";
import BlockElement from "./BlockElement";

const d = [
  {
    level: 0,
    type: BlockType.TEXT,
    data: { text: "" },
  },
  {
    level: 1,
    type: BlockType.H1,
    data: { text: "" },
  },
  {
    level: 2,
    type: BlockType.H2,
    data: { text: "" },
  },
  {
    level: 3,
    type: BlockType.H3,
    data: { text: "" },
  },
  {
    level: 4,
    type: BlockType.TEXT,
    data: { text: "" },
  },
  {
    level: 5,
    type: BlockType.TEXT,
    data: { text: "" },
  },
  {
    level: 6,
    type: BlockType.TEXT,
    data: { text: "" },
  },
  // {
  //   level: 3,
  //   type: BlockType.H4,
  //   data: { text: "" },
  // },
  // {
  //   level: 3,
  //   type: BlockType.H5,
  //   data: { text: "" },
  // },
  // {
  //   level: 3,
  //   type: BlockType.H6,
  //   data: { text: "" },
  // },
];

const editor = new Editor();

export default function EditorComponent() {
  // const [blocks, setBlocks] = useState<Block[]>(editor.getBlocks());
  const [blocks, setBlocks] = useState<Block[]>(d);
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Save blocks every 10 seconds
  // useEffect(() => {
  //  // TODO: major bug
  //  const intervalId = setInterval(() => {
  //   console.log("Saving blocks:", editor.getBlocks());
  //  }, 10000);

  //  return () => clearInterval(intervalId);
  // }, []);

  return (
    <div>
      {blocks.map((block, index) => (
        <BlockElement
          setBlocks={setBlocks}
          blocks={blocks}
          block={block}
          currBlockType={block.type}
          index={index}
          inputRefs={inputRefs}
          editor={editor}
        />
      ))}
      <button>Add Block</button>
    </div>
  );
}

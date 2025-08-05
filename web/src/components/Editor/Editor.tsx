import Block from "@/lib/Editor/Block";
import Editor from "@/lib/Editor/Editor";
import { useState, useRef, useEffect } from "react";
import BlockElement from "./BlockElement";

const editor = new Editor();

export default function EditorComponent() {
  // const [blocks, setBlocks] = useState<Block[]>(editor.getBlocks());
  const [blocks, setBlocks] = useState<Block[]>(editor.getBlocks());
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Save blocks every 10 seconds
  // useEffect(() => {
  //  // TODO: major bug
  //  const intervalId = setInterval(() => {
  //   console.log("Saving blocks:", editor.getBlocks());
  //  }, 10000);

  //  return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
    if (inputRefs.current.length !== blocks.length) {
      inputRefs.current = Array(blocks.length)
        .fill(null)
        .map((_, i) => inputRefs.current[i] || null);
    }
  }, [blocks.length]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []); // Run once on mount

  return (
    <div id="editor">
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
    </div>
  );
}

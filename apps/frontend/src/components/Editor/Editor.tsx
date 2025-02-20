"use client";

import Block from "@/lib/Editor/Block";
import Editor from "@/lib/Editor/Editor";
import { BlockType } from "@/types/editor";
import React, { useState, useRef, useEffect } from "react";
import BlockElement from "./BlockElement";

const d = [
 {
  level: 0,
  type: BlockType.TEXT,
  data: { text: "" },
 },
 {
  level: 1,
  type: BlockType.TEXT,
  data: { text: "" },
 },
 {
  level: 2,
  type: BlockType.TEXT,
  data: { text: "" },
 },
 {
  level: 3,
  type: BlockType.TEXT,
  data: { text: "" },
 },
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
     blocks={blocks}
     block={block}
     setBlocks={setBlocks}
     index={index}
     inputRefs={inputRefs}
     editor={editor}
    />
   ))}
   <button>Add Block</button>
  </div>
 );
}

"use client";

import Block from "@/lib/Editor/Block";
import Editor from "@/lib/Editor/Editor";
import { BlockType } from "@/types/editor";
import React, { useState, useRef, useEffect } from "react";

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

 // pop up  state
 const [showPopup, setShowPopup] = useState(false);
 const [popupTerm, setPopupTerm] = useState("");
 const [activeBlockIndex, setActiveBlockIndex] = useState<number | null>(null);

 const addBlock = (currLevel: number) => {
  editor.addBlock(blocks, setBlocks, BlockType.TEXT, "", currLevel);
  setBlocks([...editor.getBlocks()]);
  console.log(blocks);
 };
 // Update block

 // const updateBlock = (
 //  currLevel: number,
 //  e: React.FormEvent<HTMLDivElement>
 // ) => {
 //  const text = e.currentTarget.innerText;
 //  editor.updateBlock(currLevel, text);
 //  setBlocks([...editor.getBlocks()]);

 //  console.log(blocks);
 // };

 // key events
 const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  currLevel: number
 ) => {
  console.log(event.key, currLevel);

  if (event.key === "Enter") {
   event.preventDefault();
   editor.addBlock(blocks, setBlocks, BlockType.TEXT, "", currLevel);
  } else if (event.key === "ArrowUp") {
   editor.moveFocusUp(currLevel, inputRefs);
  } else if (event.key === "ArrowDown") {
   editor.moveFocusDown(currLevel, inputRefs);
  } else if (event.key === "/") {
   setShowPopup(true);
   setPopupTerm("");
   setActiveBlockIndex(currLevel);
  }
 };

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
   {blocks.map((block, index) => {
    // const [dropdown, setDropdown] = useState(false);
    let dropdown;
    return (
     <div
      key={block.level}
      ref={(el) => {
       inputRefs.current[index] = el;
      }}
      contentEditable
      suppressContentEditableWarning={true}
      // value={block.data.text}
      // onInput={(e) => updateBlock(block.level, e)}
      onKeyDown={(e) => handleKeyDown(e, block.level)}
     >
      {block.data.text}
     </div>
    );
   })}
   <button>Add Block</button>
  </div>
 );
}

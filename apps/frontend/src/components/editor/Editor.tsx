import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@/lib/Editor";
import { Block } from "@/lib/Block";

const editor = new Editor();

export default function EditorComponent() {
 const [blocks, setBlocks] = useState<Block[]>(editor.getBlocks());
 const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

 const addBlock = (currLevel: number) => {
  editor.addBlock("text", "", currLevel);
  setBlocks([...editor.getBlocks()]);
  console.log(blocks);
 };

 // Update block
 const updateBlock = (
  currLevel: number,
  e: React.FormEvent<HTMLDivElement>
 ) => {
  const text = e.currentTarget.innerText;
  editor.updateBlock(currLevel, text);
  setBlocks([...editor.getBlocks()]);

  console.log(blocks);
 };

 // key events
 const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  currLevel: number
 ) => {
  console.log(event.key, currLevel);

  if (event.key === "Enter") {
   event.preventDefault();
   addBlock(currLevel);
  } else if (event.key === "ArrowUp") {
   editor.moveFocusUp(currLevel, inputRefs);
  } else if (event.key === "ArrowDown") {
   editor.moveFocusDown(currLevel, inputRefs);
  }
 };

 // Save blocks every 10 seconds
 useEffect(() => {
  const intervalId = setInterval(() => {
   console.log("Saving blocks:", editor.getBlocks());
  }, 10000);

  return () => clearInterval(intervalId);
 }, []);

 return (
  <div>
   {blocks.map((block, index) => (
    <div
     key={block.level}
     ref={(el) => (inputRefs.current[index] = el)}
     contentEditable
     suppressContentEditableWarning={true}
     // value={block.data.text}
     // onInput={(e) => updateBlock(block.level, e)}
     onKeyDown={(e) => handleKeyDown(e, block.level)}
    >
     {block.data.text}
    </div>
   ))}
   <button onClick={() => addBlock()}>Add Block</button>
  </div>
 );
}

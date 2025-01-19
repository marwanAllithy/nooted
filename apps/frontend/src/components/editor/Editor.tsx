// src/components/EditorComponent.tsx
import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@/lib/Editor";
import { Block } from "@/lib/Block";

const editor = new Editor();

export default function EditorComponent() {
 const [blocks, setBlocks] = useState<Block[]>(editor.getBlocks());
 const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

 const addBlock = () => {
  editor.addBlock("text", "");
  setBlocks([...editor.getBlocks()]);
 };

 const updateBlock = (id: number, text: string) => {
  editor.updateBlock(id, text);
  setBlocks([...editor.getBlocks()]);
 };

 const handleKeyDown = (
  event: React.KeyboardEvent<HTMLInputElement>,
  id: number
 ) => {
  if (event.key === "Enter") {
   event.preventDefault();
   addBlock();
  }
 };

 useEffect(() => {
  const intervalId = setInterval(() => {
   console.log("Saving blocks:", editor.getBlocks());
  }, 10000);

  return () => clearInterval(intervalId);
 }, []);

 return (
  <div>
   {blocks.map((block, index) => (
    <div key={block.id}>
     <input
      ref={(el) => (inputRefs.current[index] = el)}
      value={block.data.text}
      onChange={(e) => updateBlock(block.id, e.target.value)}
      onKeyDown={(e) => handleKeyDown(e, block.id)}
     />
    </div>
   ))}
   <button onClick={addBlock}>Add Block</button>
  </div>
 );
}

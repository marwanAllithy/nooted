"use client";

import React, { useState, useRef } from "react";
import Block from "./Block";

type Props = {};

const blockSchema = [
 {
  type: "text",
  id: 1,
  data: {
   text: "Hello, world!",
  },
 },
 {
  type: "text",
  id: 1,
  data: {
   text: "Hello, world!",
  },
 },
];

export default function Editor({}: Props) {
 const [blocks, setBlocks] = useState(blockSchema);
 const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

 const addBlock = (index: number) => {
  setBlocks((prevBlocks) => {
   const newBlocks = [...prevBlocks];
   newBlocks.push({
    id: newBlocks.length + 1,
    type: "text",
    data: {
     text: "",
    },
   });
   newBlocks.splice(index + 1, 0, {
    id: newBlocks.length + 1,
    type: "text",
    data: {
     text: "",
    },
   });

   console.log(newBlocks);
   console.log("inputref", inputRefs);
   return newBlocks;
  });

  // focuses on the new input
  setTimeout(() => {
   inputRefs.current[index + 1]?.focus();
  }, 0);
 };
 const handleKeyNavigation = (index: number, direction: string) => {
  if (direction === "ArrowUp" && index > 0) {
   inputRefs.current[index - 1]?.focus();
  } else if (
   direction === "ArrowDown" &&
   index < inputRefs.current.length - 1
  ) {
   inputRefs.current[index + 1]?.focus();
  }
 };

 return (
  <div className="">
   {blocks.map((block, index) => (
    <Block
     block={block}
     handleKeyNavigation={handleKeyNavigation}
     index={index}
     addBlock={addBlock}
     inputRef={(el) => (inputRefs.current[index] = el)}
    />
   ))}
  </div>
 );
}

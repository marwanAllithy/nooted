"use client";

import React, { useState, useRef, useEffect } from "react";
import Block from "./Block";
import saveTextBlocks from "@/lib/helper/saveTextBlocks";

type Props = {};

const blockSchema = [
 {
  id: 0,
  type: "text",
  data: {
   text: "Hello, world!",
  },
 },
 {
  id: 1,
  type: "text",
  data: {
   text: "Hello, world!",
  },
 },
];

export default function Editor({}: Props) {
 const [blocks, setBlocks] = useState(blockSchema);
 const [loading, setLoading] = useState(false);
 const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

 const addBlock = (index: number) => {
  setBlocks((prevBlocks) => {
   const newBlocks = [...prevBlocks];
   const firstHalf = newBlocks.slice(0, index + 1);
   const secondHalf = newBlocks.slice(index + 1);

   const parsedSecondHalf = secondHalf.map((block) => {
    return {
     ...block,
     id: block.id + 1,
    };
   });

   const newBlock = {
    id: index + 1,
    type: "text",
    data: {
     text: "",
    },
   };

   console.log("first half", firstHalf);
   console.log("second half", secondHalf);
   console.log("new blocks", [...firstHalf, newBlock, ...parsedSecondHalf]);
   console.log("inputref", inputRefs);
   console.log("index", index);

   return [...firstHalf, newBlock, ...parsedSecondHalf];
  });

  // focuses on the new input
  setTimeout(() => {
   inputRefs.current[index + 1]?.focus();
  }, 10);
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

 // TODO: do a wholistic saving system
 useEffect(() => {
  const intervalId = setInterval(() => {
   saveTextBlocks(inputRefs, blocks, setBlocks, loading, setLoading);
  }, 10000); // 10000 milliseconds = 10 seconds

  return () => clearInterval(intervalId); // Cleanup interval on component unmount
 }, [inputRefs, blocks, loading, setLoading]);

 
 return (
  <div className="">
   {blocks.map((block, index) => (
    <Block
     block={block}
     handleKeyNavigation={handleKeyNavigation}
     index={index}
     key={block.id}
     addBlock={addBlock}
     inputRef={(el) => (inputRefs.current[index] = el)}
    />
   ))}
  </div>
 );
}

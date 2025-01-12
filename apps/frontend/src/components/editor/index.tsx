"use client";

import React, { useState, useRef, useMemo } from "react";
import Block from "./Block";

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

function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
 let timeout: NodeJS.Timeout;
 return (...args: Parameters<T>) => {
  clearTimeout(timeout);
  timeout = setTimeout(() => func(...args), wait);
 };
}

export default function Editor({}: Props) {
 const [blocks, setBlocks] = useState(blockSchema);
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

 const handleBlockChange = useMemo(
  () =>
   debounce((index: number, text: string) => {
    setBlocks((prev) =>
     prev.map((block, i) =>
      i === index ? { ...block, data: { text } } : block
     )
    );
   }, 400),
  []
 );

 return (
  <div className="">
   {blocks.map((block, index) => (
    <Block
     block={block}
     handleKeyNavigation={handleKeyNavigation}
     index={index}
     handleBlockChange={handleBlockChange}
     addBlock={addBlock}
     inputRef={(el) => (inputRefs.current[index] = el)}
    />
   ))}
  </div>
 );
}

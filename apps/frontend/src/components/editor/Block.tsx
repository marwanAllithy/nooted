import React from "react";
import { Input } from "../ui/input";
import {TextBlock} from "../blocks";

type Props = {
 index: number;
 addBlock: (index: number) => void;
 inputRef: (el: HTMLInputElement | null) => void;
 handleKeyNavigation: (index: number, direction: string) => void;
 block: {
  type: string;
  id: number;
  data: {
   text: string;
  };
 };
};

export default function Block({
 index,
 block,
 addBlock,
 inputRef,
 handleKeyNavigation,
}: Props) {
 const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
  console.log("key: ", event.key);
  if (event.key === "Enter") {
   event.preventDefault();
   addBlock(index);
  }

  if (event.key === "ArrowUp" || "ArrowDown") {
   handleKeyNavigation(index, event.key as string);
  }
 };

 switch (block.type) {
  case "text":
   return (
    <TextBlock
     handleKeyDown={handleKeyDown}
     inputRef={inputRef}
     text={block.data.text}
    />
   );
 }
}

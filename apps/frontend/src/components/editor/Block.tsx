import React from "react";
import { Input } from "../ui/input";
import {
 TextBlock,
 Header1,
 Header2,
 Header3,
 Header4,
 Header5,
 Header6,
} from "../blocks";

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
   break;

  case "h1":
   return (
    <Header1
     handleKeyDown={handleKeyDown}
     inputRef={inputRef}
     text={block.data.text}
    />
   );
   break;

  case "h2":
   return (
    <Header2
     handleKeyDown={handleKeyDown}
     inputRef={inputRef}
     text={block.data.text}
    />
   );
   break;

  case "h3":
   return (
    <Header3
     handleKeyDown={handleKeyDown}
     inputRef={inputRef}
     text={block.data.text}
    />
   );
   break;

  case "h4":
   return (
    <Header4
     handleKeyDown={handleKeyDown}
     inputRef={inputRef}
     text={block.data.text}
    />
   );
   break;

  case "h5":
   return (
    <Header5
     handleKeyDown={handleKeyDown}
     inputRef={inputRef}
     text={block.data.text}
    />
   );
   break;

  case "h6":
   return (
    <Header6
     handleKeyDown={handleKeyDown}
     inputRef={inputRef}
     text={block.data.text}
    />
   );
   break;
 }
}

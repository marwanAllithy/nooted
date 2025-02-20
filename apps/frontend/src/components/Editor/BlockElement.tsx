import Block from "@/lib/Editor/Block";
import { BlockType } from "@/types/editor";
import React from "react";

type Props = {
 blocks: Block[];
 block: Block;
 setBlocks: any;
 index: number;
 inputRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
 editor: any;
};

export default function BlockElement({
 blocks,
 block,
 setBlocks,
 index,
 inputRefs,
 editor,
}: Props) {
 const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  currLevel: number
 ) => {
  console.log(event.key, currLevel);
  switch (event.key) {
   case "Enter":
    event.preventDefault();
    editor.addBlock(blocks, setBlocks, BlockType.TEXT, "", currLevel);
    break;
   case "ArrowUp":
    editor.moveFocusUp(currLevel, inputRefs);
    break;
   case "ArrowDown":
    editor.moveFocusDown(currLevel, inputRefs);
    break;
   case "/":
    // Handle popup logic here
    break;
   default:
    break;
  }
 };
 return (
  <div
   key={block?.level}
   ref={(el) => {
    inputRefs.current[index] = el;
   }}
   contentEditable
   suppressContentEditableWarning={true}
   onKeyDown={(e) => handleKeyDown(e, block.level)}
  >
   {block.data.text}
  </div>
 );
}

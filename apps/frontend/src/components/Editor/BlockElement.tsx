import Block from "@/lib/Editor/Block";
import { BlockType } from "@/types/editor";
import React, { useState } from "react";

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
 const [showAutoComplete, setShowAutoComplete] = useState(false);

 const handleKeyDown = (
  event: React.KeyboardEvent<HTMLDivElement>,
  currLevel: number
 ) => {
  console.log(event.key, currLevel);
  switch (event.key) {
   case "Enter":
    event.preventDefault();
    setShowAutoComplete(false);
    editor.addBlock(blocks, setBlocks, BlockType.TEXT, "", currLevel);
    break;
   case "ArrowUp":
    setShowAutoComplete(false);
    editor.moveFocusUp(currLevel, inputRefs);
    break;
   case "ArrowDown":
    setShowAutoComplete(false);
    editor.moveFocusDown(currLevel, inputRefs);
    break;
   case "/":
    setShowAutoComplete(true);

  // TODO: look for the search term that is written right after the / then look for it using our arrays to find the respective block type  
    // Handle popup logic here
    break;
   default:
    break;
  }
 };
 return (
  <>
   <div
    className="prose relative "
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
   {showAutoComplete && (
    <div className="absolute z-20 ">
     <div>AutoComplete</div>
    </div>
   )}
  </>
 );
}

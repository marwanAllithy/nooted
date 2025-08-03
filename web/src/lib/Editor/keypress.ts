import { BlockType } from "@/types/editor";
import { getCaretPosition } from "../utils";
import type Block from "./Block";

type OnEnterTypes = {
  currentInputText: string;
  inputRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  index: number;
  blocks: Block[];
  setBlocks: any;
  currLevel: number;
  editor: any;
  setShowAutoComplete: React.Dispatch<React.SetStateAction<boolean>>;
};

export function onEnter({
  currentInputText,
  inputRefs,
  index,
  blocks,
  setBlocks,
  currLevel,
  editor,
  setShowAutoComplete,
}: OnEnterTypes) {
  const cursorPosition = getCaretPosition(inputRefs.current[index]);

  if (currentInputText && cursorPosition == 0) {
    blocks[currLevel].data.text = "";
    editor.addBlock(
      blocks,
      setBlocks,
      BlockType.TEXT,
      currentInputText as string,
      currLevel,
    );
  } else if (cursorPosition != 0) {
    // TODO: split string on enter
    const inputFirstHalf =
      cursorPosition != 0
        ? currentInputText?.slice(0, cursorPosition)
        : (currentInputText as string);

    const inputSecondHalf =
      cursorPosition != 0
        ? currentInputText?.slice(cursorPosition)
        : (currentInputText as string);

    console.log("cursorPosition", cursorPosition);

    console.log("input halfs", inputFirstHalf, inputSecondHalf);
    setShowAutoComplete(false);
    // change the current block

    blocks[currLevel].data.text = inputFirstHalf as string;

    editor.addBlock(
      blocks,
      setBlocks,
      BlockType.TEXT,
      inputSecondHalf as string,
      currLevel,
    );
  } else {
    editor.addBlock(blocks, setBlocks, BlockType.TEXT, "", currLevel);
  }
  setTimeout(() => {
    inputRefs?.current[currLevel + 1]?.focus();
  }, 0);
}
type onDeleteProps = {
  currentInputText: string;
  inputRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  index: number;
  blocks: Block[];
  setBlocks: any;
  currLevel: number;
  editor: any;
};

export function onDelete({
  currentInputText,
  inputRefs,
  index,
  blocks,
  setBlocks,
  currLevel,
  editor,
}: onDeleteProps) {
  // const caretPos = getCaretPosition(inputRefs.current[index]);

  // // If input is empty, delete the block and move focus up
  // if (!currentInputText || currentInputText.length === 0) {
  //   if (blocks.length <= 1) return; // Don't delete the last block
  //   const newBlocks = blocks.filter((_, i) => i !== currLevel);
  //   setBlocks(newBlocks);
  //   setTimeout(() => {
  //     inputRefs.current[currLevel - 1]?.focus();
  //   }, 0);
  //   return;
  // }

  // // If there is text behind the cursor, delete one character normally
  // if (caretPos > 0) {
  //   const newText =
  //     currentInputText.slice(0, caretPos - 1) +
  //     currentInputText.slice(caretPos);
  //   blocks[currLevel].data.text = newText;
  //   setBlocks([...blocks]);
  //   setTimeout(() => {
  //     // Restore caret position
  //     const el = inputRefs.current[currLevel];
  //     if (el) {
  //       const range = document.createRange();
  //       const sel = window.getSelection();
  //       range.setStart(el.firstChild || el, caretPos - 1);
  //       range.collapse(true);
  //       sel?.removeAllRanges();
  //       sel?.addRange(range);
  //     }
  //   }, 0);
  //   return;
  // }

  // // If no text behind, but text in front, merge with block above
  // if (caretPos === 0 && currentInputText.length > 0 && currLevel > 0) {
  //   const prevBlock = blocks[currLevel - 1];
  //   const prevText = prevBlock.data.text || "";
  //   prevBlock.data.text = prevText + currentInputText;
  //   const newBlocks = blocks.filter((_, i) => i !== currLevel);
  //   setBlocks(newBlocks);
  //   setTimeout(() => {
  //     inputRefs.current[currLevel - 1]?.focus();
  //     // Optionally, move caret to end of previous block
  //     const el = inputRefs.current[currLevel - 1];
  //     if (el) {
  //       const range = document.createRange();
  //       const sel = window.getSelection();
  //       const len = prevBlock.data.text.length;
  //       range.setStart(el.firstChild || el, len);
  //       range.collapse(true);
  //       sel?.removeAllRanges();
  //       sel?.addRange(range);
  //     }
  //   }, 0);
  //   return;
  // }
}

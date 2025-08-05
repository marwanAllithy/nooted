import { BlockType } from "@/types/editor";
import { getCaretPosition, sanitize, setCaretPosition } from "../utils";
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
      sanitize(currentInputText) as string,
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

// TODO: preverse the cursor position

export function onDelete({
  currentInputText,
  inputRefs,
  index,
  blocks,
  setBlocks,
  editor,
  currLevel,
}: onDeleteProps) {
  const text = sanitize(currentInputText) as string;
  const cursorPosition = getCaretPosition(inputRefs.current[index]);

  // Remove the corresponding ref

  console.log("onDelete", text, cursorPosition, blocks);

  if (currLevel === 0) {
    // do nothing
  } else if (cursorPosition === 0 && text === "") {
    editor.deleteBlock(blocks, setBlocks, currLevel);
    inputRefs?.current[currLevel - 1]?.focus();
  } else if (cursorPosition === 0 && text !== "") {
    // add the remaining text to the block before
    const prevBlockLength = blocks[currLevel - 1].data.text.length;
    blocks[currLevel - 1].data.text += text;
    blocks[currLevel].data.text = "";

    console.log("prevBlockLength", prevBlockLength);
    editor.deleteBlock(blocks, setBlocks, currLevel);

    setTimeout(() => {
      inputRefs?.current[currLevel - 1]?.focus();
      setCaretPosition(inputRefs.current[currLevel - 1], prevBlockLength);
    }, 0);
  }
}

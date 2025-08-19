import { BlockType } from "@/types/editor";
import { getCaretPosition, sanitize, setCaretPosition } from "../utils";
import type Block from "./Block";

type Inputs = {
  currentInputText: string;
  inputRefs: React.RefObject<(HTMLDivElement | null)[]>;
  index: number;
  blocks: Block[];
  setBlocks: any;
  currLevel: number;
  editor: any;
};

const headerTypes = [
  BlockType.H1,
  BlockType.H2,
  BlockType.H3,
  BlockType.H4,
  BlockType.H5,
  BlockType.H6,
];
// TODO: move into editor class

export function onEnter({
  currentInputText,
  inputRefs,
  index,
  blocks,
  setBlocks,
  currLevel,
  editor,
}: Inputs) {
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

// TODO: preverse the cursor position

export function onDelete({
  currentInputText,
  inputRefs,
  index,
  blocks,
  setBlocks,
  editor,
  currLevel,
}: Inputs) {
  const text = sanitize(currentInputText) as string;
  const cursorPosition = getCaretPosition(inputRefs.current[index]);

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

    editor.deleteBlock(blocks, setBlocks, currLevel);

    // setTimeout(() => {
    inputRefs?.current[currLevel - 1]?.focus();
    setCaretPosition(inputRefs.current[currLevel - 1], prevBlockLength);
    // }, 0);
  }
}

export function onHeader({
  editor,
  currentInputText,
  blocks,
  setBlocks,
  currLevel,
}: Inputs) {
  const text = sanitize(currentInputText) as string;
  const match = text.match(/^(#{1,6})\s?/);
  const hashCount: number = match?.[1]?.length ?? 0;

  const newType = headerTypes[hashCount] || BlockType.H1;
  if (newType) {
    const newText = text.replace(/^(#{1,6})\s?/, "");
    blocks[currLevel].data.text = newText;
    editor.changeBlockType(setBlocks, currLevel, newType);
    setBlocks([...blocks]);
  }
}

// splits block text with spaces
// checks the first part of the split
// change block type cording to the first split sytax
// remove the sytax and keep the remaining text
// change for valid sytax

export function onSpace({
  editor,
  currentInputText,
  blocks,
  inputRefs,
  index,
  setBlocks,
  currLevel,
}: Inputs) {
  // const cursorPosition = getCaretPosition(inputRefs.current[index]);

  const splitText = currentInputText.split(" ");
  const syntax = splitText[0];

  console.log("1", splitText, syntax, splitText.length);

  splitText.shift();
  let text: string;

  if (splitText.length) {
    text = splitText.join(" ");
  } else {
    text = " ";
  }

  console.log("2", splitText, syntax, text, splitText.length);
  // if (cursorPosition === 0) {
  // const syntaxLength = syntax.length;

  switch (syntax) {
    case "#":
      editor.changeBlockType(setBlocks, currLevel, BlockType.H1);
      break;

    default:
  }

  // useless, remove the synxtax split
  console.log("3", splitText, syntax, text, splitText.length);
  setTimeout(() => {
    if (text) {
      blocks[index].data.text = text;
      currentInputText = text;
    } else {
      blocks[index].data.text = "";
      currentInputText = "";
    }
    setCaretPosition(inputRefs.current[currLevel], 0);
    setBlocks([...blocks]);
    console.log("4", splitText, syntax, text, splitText.length);
  }, 0);

  console.log(blocks);
  // }
}

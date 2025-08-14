import { onDelete, onEnter, onHeader } from "./keybinds";
import { getCaretPosition } from "../utils";
import type Block from "./Block";

type HandleKeydownProps = {
  event: React.KeyboardEvent<HTMLDivElement>;
  currLevel: number;
  blocks: Block[];
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  inputRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  index: number;
  editor: any;
};

export default function handleKeyDown({
  blocks,
  setBlocks,
  event,
  currLevel,
  inputRefs,
  index,
  editor,
}: HandleKeydownProps) {
  const currentInputText = inputRefs.current[index]?.innerText as string;

  const prevBlockLength = blocks[currLevel - 1]?.data.text.length;
  const nextBlockLength = blocks[currLevel + 1]?.data.text.length;

  const currCursorPosition = getCaretPosition(inputRefs.current[index]);

  const inputs = {
    editor,
    currentInputText,
    inputRefs,
    index,
    blocks,
    setBlocks,
    currLevel,
  };
  console.log(event.key, currLevel);
  switch (event.key) {
    case "Enter":
      event.preventDefault();
      onEnter({
        ...inputs,
      });
      break;

    case "ArrowUp":
      event.preventDefault();
      editor.moveFocusUp(
        currLevel,
        inputRefs,
        prevBlockLength,
        currCursorPosition,
      );
      break;

    case "ArrowDown":
      event.preventDefault();
      editor.moveFocusDown(
        currLevel,
        inputRefs,
        nextBlockLength,
        currCursorPosition,
      );
      break;

    case "Backspace":
      onDelete({
        ...inputs,
      });
      break;

    case "#":
      console.log("onHeader");
      onHeader({
        ...inputs,
      });
      break;
    default:
      // save edits
      blocks[currLevel].data.text = currentInputText as string;
      setBlocks(blocks);

      break;
  }
}

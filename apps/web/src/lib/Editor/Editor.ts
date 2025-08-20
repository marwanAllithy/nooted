import Block from "./Block";
import { setCaretPosition } from "../utils";
import { BlockType } from "@/types/editor";

export default class Editor {
  blocks: Block[];
  private nextId = 0;

  constructor() {
    // create initial blocks with stable ids
    this.blocks = Array.from({ length: 7 }).map((_, i) => ({
      id: this.nextId++,
      level: i,
      type: BlockType.TEXT,
      data: { text: "" },
    }));
  }

  addBlock(
    currBlocks: any,
    setBlocks: any,
    type: BlockType,
    text: string,
    currLevel: number,
  ) {
    const firstHalf = currBlocks.slice(0, currLevel + 1);
    const secondHalf = currBlocks.slice(currLevel + 1);

    // create new block with unique id and correct level
    const newBlock = {
      id: this.nextId++,
      level: currLevel + 1,
      type,
      data: { text },
    };

    // produce a new array and bump levels immutably
    const updatedSecond = secondHalf.map((b: any) => ({
      ...b,
      level: b.level + 1,
    }));

    setBlocks([...firstHalf, newBlock, ...updatedSecond]);
  }

  deleteBlock(currBlocks: Block[], setBlocks: any, currLevel: number) {
    const firstHalf = currBlocks.slice(0, currLevel);
    const secondHalf = currBlocks.slice(currLevel + 1);

    // rebuild array and recompute levels immutably
    const updated = [...firstHalf, ...secondHalf].map((b: any, i: number) => ({
      ...b,
      level: i,
    }));

    setBlocks(updated);
    console.log("blocks after delete", updated);
  }

  // ...existing code...
  changeBlockType(
    setBlocks: any,
    currLevel: number,
    type: BlockType,
    text?: string,
  ) {
    setBlocks((prevBlocks: any) => {
      const updatedBlocks = [...prevBlocks];
      const existing = updatedBlocks[currLevel] ?? { data: { text: "" } };

      updatedBlocks[currLevel] = {
        ...existing,
        type,
        data: {
          ...existing.data,
          text: text !== undefined ? text : (existing.data?.text ?? ""),
        },
      };

      return updatedBlocks;
    });
  }
  /*...existing code...*/
  // updateBlock(
  //   blocks: Block[],
  //   setBlocks: any,
  //   currLevel: number,
  //   text: string,
  // ) {
  //   setBlocks(() => {
  //     const updatedBlocks = [...blocks];
  //     updatedBlocks[currLevel].data.text = text as string;
  //     return updatedBlocks;
  //   });
  // }

  // Movements

  // TODO: Add right and left movements

  moveFocusUp(
    currLevel: number,
    inputRefs: any,
    prevBlockLength: number,
    currCursorPosition: number,
  ) {
    console.log("inputRefs", inputRefs);
    console.log("cursor position", currCursorPosition);
    if (currLevel > 0) {
      setTimeout(() => {
        // inputRefs?.current[currLevel - 1]?.focus();
        if (prevBlockLength < currCursorPosition) {
          console.log("prev lenth");
          setCaretPosition(inputRefs.current[currLevel - 1], prevBlockLength);
        } else {
          console.log("cursor lenth");
          setCaretPosition(
            inputRefs.current[currLevel - 1],
            currCursorPosition,
          );
        }
      }, 0);
    }
  }

  moveFocusDown(
    currLevel: number,
    inputRefs: any,
    nextBlockLength: number,
    currCursorPosition: number,
  ) {
    console.log("inputRefs", inputRefs);
    console.log("cursor position", currCursorPosition);

    if (currLevel < inputRefs?.current.length - 1) {
      setTimeout(() => {
        inputRefs?.current[currLevel + 1]?.focus();
        if (nextBlockLength < currCursorPosition) {
          console.log("next lenth");
          setCaretPosition(inputRefs.current[currLevel + 1], nextBlockLength);
        } else {
          console.log("cursor lenth");
          setCaretPosition(
            inputRefs.current[currLevel + 1],
            currCursorPosition,
          );
        }
      }, 0);
    }
  }

  getBlocks() {
    return this.blocks;
  }
}

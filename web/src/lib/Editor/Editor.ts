import { BlockType } from "@/types/editor";
import Block from "./Block";
import { setCaretPosition } from "../utils";

export default class Editor {
  blocks: Block[];

  constructor() {
    this.blocks = [
      {
        level: 0,
        type: BlockType.H1,
        data: { text: "" },
      },
      {
        level: 1,
        type: BlockType.H1,
        data: { text: "" },
      },
      {
        level: 2,
        type: BlockType.H2,
        data: { text: "" },
      },
      {
        level: 3,
        type: BlockType.H3,
        data: { text: "" },
      },
      {
        level: 4,
        type: BlockType.TEXT,
        data: { text: "" },
      },
      {
        level: 5,
        type: BlockType.TEXT,
        data: { text: "" },
      },
      {
        level: 6,
        type: BlockType.TEXT,
        data: { text: "" },
      },
      // {
      //   level: 3,
      //   type: BlockType.H4,
      //   data: { text: "" },
      // },
      // {
      //   level: 3,
      //   type: BlockType.H5,
      //   data: { text: "" },
      // },
      // {
      //   level: 3,
      //   type: BlockType.H6,
      //   data: { text: "" },
      // },
    ];
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
    // const id = this.blocks.length;
    const newBlock = new Block(currLevel + 1, type, text);
    secondHalf.forEach((block: any) => {
      block.level += 1;
    });
    setBlocks([...firstHalf, newBlock, ...secondHalf]);
  }

  deleteBlock(currBlocks: Block[], setBlocks: any, currLevel: number) {
    const firstHalf = currBlocks.slice(0, currLevel);
    const secondHalf = currBlocks.slice(currLevel + 1);
    secondHalf.forEach((block: any) => {
      block.level -= 1;
    });

    setBlocks([...firstHalf, ...secondHalf]);
    console.log("blocks after delete", currBlocks);
  }

  changeBlockType(setBlocks: any, currLevel: number, type: BlockType) {
    setBlocks((prevBlocks: any) => {
      const updatedBlocks = [...prevBlocks];
      updatedBlocks[currLevel].type = type;
      return updatedBlocks;
    });
  }

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

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

  deleteBlock(currBlocks: [Block], setBlocks: any, currLevel: number) {
    const firstHalf = currBlocks.slice(0, currLevel);
    const secondHalf = currBlocks.slice(currLevel + 1);
    secondHalf.forEach((block: any) => {
      block.level -= 1;
    });

    setBlocks([...firstHalf, ...secondHalf]);
    console.log("blocks after delete", currBlocks);
  }

  updateBlock(
    blocks: Block[],
    setBlocks: any,
    currLevel: number,
    text: string,
  ) {
    setBlocks(() => {
      const updatedBlocks = [...blocks];
      updatedBlocks[currLevel].data.text = text as string;
      return updatedBlocks;
    });
  }

  // Movements

  // TODO: Add right and left movements

  moveFocusUp(currLevel: number, inputRefs: any, prevBlockLength: number = 0) {
    console.log("inputRefs", inputRefs);
    if (currLevel > 0) {
      inputRefs?.current[currLevel - 1]?.focus();
    }
  }

  moveFocusDown(
    currLevel: number,
    inputRefs: any,
    prevBlockLength: number = 0,
  ) {
    console.log("inputRefs", inputRefs);
    if (currLevel < inputRefs?.current.length - 1) {
      setTimeout(() => {
        inputRefs?.current[currLevel + 1]?.focus();
        setCaretPosition(inputRefs.current[currLevel - 1], prevBlockLength);
      }, 0);
    }
  }

  getBlocks() {
    return this.blocks;
  }
}

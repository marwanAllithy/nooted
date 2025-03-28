import { BlockType } from "@/types/editor";
import Block from "./Block";

export default class Editor {
  blocks: Block[];

  constructor() {
    this.blocks = [];
  }

  addBlock(
    currBlocks: any,
    setBlocks: any,
    type: BlockType,
    text: string,
    currLevel: number
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

  updateBlock(currLevel: number, text: string) {
    const block = this.blocks.find((block) => block.level === currLevel);
    if (block) {
      block.data.text = text;
    }
  }

  moveFocusUp(currLevel: number, inputRefs: any) {
    if (currLevel > 0) {
      inputRefs?.current[currLevel - 1]?.focus();
    }
  }

  moveFocusDown(currLevel: number, inputRefs: any) {
    console.log("inputRefs", inputRefs);
    if (currLevel < inputRefs?.current.length - 1) {
      inputRefs?.current[currLevel + 1]?.focus();
    }
  }

  getBlocks() {
    return this.blocks;
  }
}

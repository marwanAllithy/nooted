// src/lib/Editor.ts
import { Block } from "./Block";

export class Editor {
  blocks: Block[];

  constructor() {
    this.blocks = [];
  }

  addBlock(type: string, text: string) {
    const id = this.blocks.length;
    const newBlock = new Block(id, type, text);
    this.blocks.push(newBlock);
  }

  updateBlock(id: number, text: string) {
    const block = this.blocks.find((block) => block.id === id);
    if (block) {
      block.data.text = text;
    }
  }

  getBlocks() {
    return this.blocks;
  }
}
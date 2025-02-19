// src/lib/Editor.ts
import { BlockType } from "@/types/editor";
import { Block } from "./Block";

export class Editor {
 blocks: Block[];

 constructor() {
  this.blocks = [];
 }

 // TODO: add back the BlockType Enum
 addBlock(
  blocks: any,
  setBlocks: any,
  type: string,
  text: string,
  currLevel: number
 ) {
  const updatedBlocks = [];

  console.log("Adding block", type, text, currLevel);

  const firstHalf = blocks.slice(0, currLevel + 1);
  const secondHalf = blocks.slice(currLevel + 1);

  console.log("halves: ", firstHalf, secondHalf);

  const id = this.blocks.length;
  const newBlock = new Block(id, type, text);

  // TODO: use current level to input the new block in it's correct place

  // this.blocks.push(newBlock);

  setBlocks([...firstHalf, newBlock, ...secondHalf]);
 }

 updateBlock(currLevel: number, text: string) {
  const block = this.blocks.find((block) => block.level === currLevel);
  if (block) {
   block.data.text = text;
  }
 }

 moveFocusUp(currLevel: number, inputRefs: any) {
  const index = this.blocks.findIndex((block) => block.level === currLevel);
  if (index > 0) {
   inputRefs?.current[index - 1]?.focus();
  }
 }

 moveFocusDown(
  currLevel: number,
  // inputRefs: React.RefObject<(HTMLDivElement | null)[]>
  inputRefs: any
 ) {
  const index = this.blocks.findIndex((block) => block.level === currLevel);
  if (index < inputRefs?.current.length - 1) {
   inputRefs?.current[index + 1]?.focus();
  }
 }

 getBlocks() {
  return this.blocks;
 }
}

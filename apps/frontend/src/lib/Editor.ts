// src/lib/Editor.ts
import { Block } from "./Block";

export class Editor {
 blocks: Block[];

 constructor() {
  this.blocks = [];
 }

 addBlock(type: string, text: string, currLevel: number) {
  const id = this.blocks.length;
  const newBlock = new Block(id, type, text);
  this.blocks.push(newBlock);
 }

 updateBlock(currLevel: number, text: string) {
  const block = this.blocks.find((block) => block.level === currLevel);
  if (block) {
   block.data.text = text;
  }
 }

 moveFocusUp(
  currLevel: number,
  inputRefs: React.RefObject<(HTMLDivElement | null)[]>
 ) {
  const index = this.blocks.findIndex((block) => block.level === currLevel);
  if (index > 0) {
   inputRefs.current[index - 1]?.focus();
  }
 }

 moveFocusDown(
  currLevel: number,
  inputRefs: React.RefObject<(HTMLDivElement | null)[]>
 ) {
  const index = this.blocks.findIndex((block) => block.level === currLevel);
  if (index < inputRefs.current.length - 1) {
   inputRefs.current[index + 1]?.focus();
  }
 }

 getBlocks() {
  return this.blocks;
 }
}

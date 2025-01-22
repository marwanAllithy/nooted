import { BlockType } from "@/types/editor";

export class Block {
 level: number;
 type: BlockType;
 data: { text: string };

 constructor(level: number, type: BlockType, text: string) {
  this.level = level;
  this.type = type;
  this.data = { text };
 }
}

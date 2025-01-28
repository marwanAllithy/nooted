import { BlockType } from "@/types/editor";

export class Block {
 level: number;
 type: BlockType;
 data: { text: string };

 // TODO: add back the BlockType Enum
 constructor(level: number, type: string, text: string) {
  this.level = level;
  this.type = type;
  this.data = { text };
 }
}

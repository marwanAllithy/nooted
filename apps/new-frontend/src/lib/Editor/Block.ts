import { BlockType } from "@/types/editor";

export default class Block {
 level: number;
 type: BlockType;
 data: { text: string };

 // TODO: add back the BlockType Enum
 constructor(level: number, type: BlockType, text: string) {
  this.level = level;
  this.type = type;
  this.data = { text };
 }
}

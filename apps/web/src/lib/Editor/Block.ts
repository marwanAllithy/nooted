import { BlockType } from "@/types/editor";

export default class Block {
  id: number;
  level: number;
  type: BlockType;
  data: { text: string };

  // TODO: add back the BlockType Enum
  constructor(level: number, type: BlockType, text: string, id: number) {
    this.id = id; // or use any unique id generation logic
    this.level = level;
    this.type = type;
    this.data = { text };
  }
}

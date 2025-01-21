export class Block {
  level: number;
  type: string;
  data: { text: string };

  constructor(level: number, type: string, text: string) {
    this.level = level;
    this.type = type;
    this.data = { text };
  }
}
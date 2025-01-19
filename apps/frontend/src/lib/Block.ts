export class Block {
  id: number;
  type: string;
  data: { text: string };

  constructor(id: number, type: string, text: string) {
    this.id = id;
    this.type = type;
    this.data = { text };
  }
}
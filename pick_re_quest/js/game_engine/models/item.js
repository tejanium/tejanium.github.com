import Object from "./object.js";

export default class Item extends Object {
  constructor(position) {
    super(position);
    this.type = "item";
  }
}

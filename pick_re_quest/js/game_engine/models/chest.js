import Object from "./object.js";
import Const from "../const.js";

export default class Chest extends Object {
  constructor(id, position) {
    super(position);
    this.type = "chest";
    this.id = id;
    this.items = [];
    this.unlocker = null;
  }

  get open() {
    return Math.abs(this.unlocker.y - this.y) == 2;
  }

  addItem(item) {
    this.items.push(item);
  }

  get emptyX() {
    return Const.GROUND_FLOOR - this.items.length;
  }
}

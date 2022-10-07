import Object from "./object.js";
import Const from "../const.js";

export default class Player extends Object {
  constructor(id, position, direction) {
    super(position);
    this.id = id;
    this.type = "player";
    this.direction = direction;
    this.item_direction = direction;
    this.chest_direction = Const.oppositeDirection(direction);
    this.load = null;
    this.chest = null;
  }

  isNeedHelp() {
    return this.atTheChest && this.load && this.chest.open == false;
  }

  get atTheEdge() {
    return this.y === Const.LEFT_EDGE || this.y === Const.RIGHT_EDGE;
  }

  get atTheChest() {
    return Math.abs(this.y - this.chest.y) === 1;
  }

  swithDirection() {
    this.direction = Const.oppositeDirection(this.direction);
  }

  get nextToChestY() {
    switch (this.item_direction) {
      case Const.LEFT:
        return this.chest.y - 1;
      case Const.RIGHT:
        return this.chest.y + 1;
    }
  }

  get nextY() {
    switch (this.direction) {
      case Const.LEFT:
        return this.y - 1;
      case Const.RIGHT:
        return this.y + 1;
      default:
        return this.y;
    }
  }
}

import Const from "../const.js";

export default class Object {
  constructor(position) {
    this.position = position;
    this.type = null;
  }

  set position(position) {
    this.x = position[0];
    this.y = position[1];
  }

  get position() {
    return [this.x, this.y];
  }

  get leftY() {
    return Math.max(this.y - 1, Const.LEFT_EDGE);
  }

  get rightY() {
    return Math.min(this.y + 1, Const.RIGHT_EDGE);
  }

  get belowX() {
    return Math.min(this.x + 1, Const.GROUND_FLOOR);
  }

  get onTheGround() {
    return this.x === Const.GROUND_FLOOR;
  }
}

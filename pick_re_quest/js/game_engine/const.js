export default class Const {
  static WIDTH = 22;
  static HEIGHT = 5;

  static GROUND_FLOOR = Const.HEIGHT - 1;
  static FIRST_FLOOR = Const.GROUND_FLOOR - 1;

  static LEFT_EDGE = 0;
  static RIGHT_EDGE = Const.WIDTH - 1;

  static LEFT = "left";
  static RIGHT = "right";

  static oppositeDirection(direction) {
    if (direction === Const.LEFT) {
      return Const.RIGHT;
    } else {
      return Const.LEFT;
    }
  }
}

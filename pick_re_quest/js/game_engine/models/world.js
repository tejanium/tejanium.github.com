import Tile from "./tile.js";
import Const from "../const.js";

export default class World {
  constructor() {
    this.matrix = this.#buildMatrix();
    this.objects = [];
  }

  #buildMatrix() {
    let matrix = [];

    for (let row_number = 0; row_number < Const.HEIGHT; row_number++) {
      matrix[row_number] = [];

      for (let col_number = 0; col_number < Const.WIDTH; col_number++) {
        matrix[row_number][col_number] = new Tile();
      }
    }

    return matrix;
  }

  seedMatrix() {
    // The Matrix
    // [0, 0] [0, 1] [0, 2]
    // [1, 0] [1, 1] [1, 2]
    // [2, 0] [2, 1] [2, 2]

    this.objects.forEach((object) => {
      this.setMatrix(object);
    });
  }

  movePlayer(player, new_y) {
    this.moveObject(player, Const.GROUND_FLOOR, new_y);
  }

  #resetTile(x, y) {
    this.matrix[x][y].reset();
  }

  addObject(object) {
    this.objects.push(object);
  }

  addObjects(objects) {
    objects.forEach((object) => this.addObject(object));
  }

  setMatrix(object) {
    this.matrix[object.x][object.y].object = object;
  }

  moveObject(object, x, y) {
    this.#resetTile(object.x, object.y);
    object.position = [x, y];
    this.setMatrix(object);
  }

  applyGravity() {
    this.objects.forEach((object) => {
      if (!object.onTheGround && this.emptyBelow(object)) {
        this.moveObject(object, object.x + 1, object.y);
      }
    });
  }

  getSurroundings(object) {
    return [this.leftHandObject(object), this.rightHandObject(object)];
  }

  getSurroundingsItem(object) {
    return this.getSurroundings(object).find((n) => n.type === "item");
  }

  leftHandObject(object) {
    return this.matrix[object.x][object.leftY].object;
  }

  rightHandObject(object) {
    return this.matrix[object.x][object.rightY].object;
  }

  belowObject(object) {
    return this.matrix[object.belowX][object.y].object;
  }

  emptyBelow(object) {
    return this.belowObject(object).type === "empty";
  }
}

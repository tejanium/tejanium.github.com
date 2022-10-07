import Item from "./models/item.js";
import Player from "./models/player.js";
import Chest from "./models/chest.js";
import World from "./models/world.js";
import Const from "./const.js";

export class GameEngine {
  constructor(game_configuration) {
    const { p1_loc, c1_loc, p2_loc, c2_loc, d1, d2 } = game_configuration;

    this.total_items = d1 + d2;
    this.turn_count = 0;

    this.world = new World();

    this.player_1 = new Player(1, [Const.GROUND_FLOOR, p1_loc], Const.LEFT);
    this.player_1.chest = new Chest(1, [Const.GROUND_FLOOR, c1_loc]);

    this.player_2 = new Player(2, [Const.GROUND_FLOOR, p2_loc], Const.RIGHT);
    this.player_2.chest = new Chest(2, [Const.GROUND_FLOOR, c2_loc]);

    this.player_1.chest.unlocker = this.player_2;
    this.player_2.chest.unlocker = this.player_1;

    this.world.addObjects([
      this.player_1,
      this.player_2,
      this.player_1.chest,
      this.player_2.chest,
      ...[...Array(d1)].map(
        (_, i) => new Item([Const.GROUND_FLOOR - i, Const.LEFT_EDGE])
      ),
      ...[...Array(d2)].map(
        (_, i) => new Item([Const.GROUND_FLOOR - i, Const.RIGHT_EDGE])
      ),
    ]);

    this.world.seedMatrix();
  }

  get end() {
    return (
      this.total_items > 0 &&
      this.player_1.chest.items.length + this.player_2.chest.items.length ===
        this.total_items
    );
  }

  teleportPlayer1() {
    this.#teleportPlayer(this.player_1);
    this.#movePlayer(this.player_2);

    this.turn_count += 1;
  }

  teleportPlayer2() {
    this.#teleportPlayer(this.player_2);
    this.#movePlayer(this.player_1);

    this.turn_count += 1;
  }

  nextTurn() {
    this.#movePlayer(this.player_1);
    this.#movePlayer(this.player_2);

    this.turn_count += 1;
  }

  #teleportPlayer(player) {
    if (!player.atTheChest) {
      this.world.movePlayer(player, player.nextToChestY);
      player.direction = player.chest_direction;

      if (player.load) {
        player.load = null;
        this.world.applyGravity();
      }
    }
  }

  #movePlayer(player) {
    if (player.load) {
      this.#playerHaveItemTick(player);
    } else {
      this.#playerHaveNothingTick(player);
    }
  }

  #carryItem(player, item) {
    this.world.moveObject(item, Const.FIRST_FLOOR, player.y);
  }

  #playerHaveItemTick(player) {
    if (player.atTheChest) {
      if (player.chest.open) {
        this.#storeItem(player);
      } else {
        player.swithDirection();

        this.world.movePlayer(player, player.nextY);
        this.#carryItem(player, player.load);
      }
    } else if (player.atTheEdge) {
      player.swithDirection();

      this.world.movePlayer(player, player.nextY);
      this.#carryItem(player, player.load);
    } else {
      const item = this.world.getSurroundingsItem(player);

      if (item && player.direction === player.item_direction) {
        player.swithDirection();
      }

      this.world.movePlayer(player, player.nextY);
      this.#carryItem(player, player.load);
    }
  }

  #playerHaveNothingTick(player) {
    if (player.atTheEdge || player.atTheChest) {
      player.swithDirection();

      this.world.movePlayer(player, player.nextY);
    } else {
      const item = this.world.getSurroundingsItem(player);

      if (item) {
        player.swithDirection();
        player.load = item;
        this.#carryItem(player, item);
        this.world.applyGravity();
      } else {
        this.world.movePlayer(player, player.nextY);
      }
    }
  }

  #storeItem(player) {
    player.chest.addItem(player.load);

    this.world.moveObject(player.load, player.chest.emptyX, player.chest.y);

    player.load = null;
  }
}

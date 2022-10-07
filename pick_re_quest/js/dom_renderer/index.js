import { el, mount } from "https://redom.js.org/redom.es.min.js";
import { GameEngine } from "../game_engine/index.js";

const game_engine = new GameEngine(window.game_configuration);
const game_container = document.getElementById("game-container");
var game_html = el("div");

mount(game_container, game_html);

function renderGameEngine() {
  const new_game_html = el("div");

  renderMatrix(new_game_html);
  renderTurnCount(new_game_html);

  if (!window.game_configuration.endless && game_engine.end) {
    setTimeout(() => {
      alert("Everyone is a winner! Total turns: " + game_engine.turn_count);
    }, 100);
  } else {
    renderNextTurnButton(new_game_html);
  }

  game_html = new_game_html;

  // Brows, please put this at the end of the queue, because render should be prioritized!!!
  if (window.game_configuration.alert) {
    setTimeout(checkTeleportable, 100);
  }
  showNextPage();
}

function showNextPage() {
  const next_page = document.getElementById("next-page");

  if (
    (next_page &&
      game_engine.turn_count >= 20 &&
      window.game_configuration.endless) ||
    game_engine.end
  ) {
    next_page.classList.remove("hidden");
  }
}

function renderMatrix(new_game_html) {
  game_engine.world.matrix.forEach((x) => {
    const row = el(".flex");

    x.forEach((y) => {
      renderObject(y.object, row);
    });

    mount(new_game_html, row);
  });

  mount(game_container, new_game_html, game_html, true);
}

function renderObject(object, row) {
  let container = el(".w-16 .h-16 .bg-gray-200 .border .border-gray p-1");

  switch (object.type) {
    case "chest":
      if (object.open) {
        mount(container, chestImage(object.id, "open"));
      } else {
        mount(container, chestImage(object.id, "closed"));
      }

      break;
    case "player":
      mount(container, charImage(object.id));
      break;
    case "item":
      mount(container, image("images/diamond.png"));
      break;
  }

  mount(row, container);
}

function color(id) {
  switch (id) {
    case 1:
      return "green";
    case 2:
      return "red";
  }
}

function image(src) {
  return el("img", { src: src, class: "h-full w-full" });
}

function chestImage(id, status) {
  return image(`images/${color(id)}_chest_${status}.png`);
}

function charImage(id) {
  return image(`images/${color(id)}_man.png`);
}

function nextTurnAndRender() {
  game_engine.nextTurn();
  renderGameEngine();
}

function renderNextTurnButton(new_game_html) {
  const button = el(
    "button",
    {
      onclick: nextTurnAndRender,
      class:
        "mt-5 bg-transparent hover:bg-green-500 text-green-700 font-semibold hover:text-white py-2 px-4 border border-green-500 hover:border-transparent rounded",
    },
    "Next Turn"
  );

  mount(new_game_html, button);
}

function renderTurnCount(new_game_html) {
  const h1 = el(
    "h1",
    {
      onclick: nextTurnAndRender,
      class: "mt-5 font-semibold text-2xl",
    },
    "Turn: " + game_engine.turn_count
  );

  mount(new_game_html, h1);
}

function checkTeleportable() {
  if (game_engine.player_2.isNeedHelp()) {
    if (
      confirm(
        "RED needs help to open the Magic Chest!\n\nTeleport GREEN to the Magic Chest?".trim()
      )
    ) {
      game_engine.teleportPlayer1();
      renderGameEngine();
    }
  }

  if (game_engine.player_1.isNeedHelp()) {
    if (
      confirm(
        "GREEN needs help to open the Magic Chest!\n\nTeleport RED to the Magic Chest?".trim()
      )
    ) {
      game_engine.teleportPlayer2();
      renderGameEngine();
    }
  }
}

renderGameEngine();

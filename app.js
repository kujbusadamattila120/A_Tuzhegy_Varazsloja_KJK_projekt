const storyNodes = {
  1: {
    text: "A barlang bejaratanal allsz.",
    image: "images/cave.jpg",
    choices: [
      {
        text: "Bemesz a barlangba",
        next: 2
      },
      {
        text: "Hazamesz",
        next: 3
      }
    ]
  },

  2: {
    text: "Egy ork jelenik meg elotted.",
    image: "images/ork.jpg",
    enemy: true,
    choices: [
      {
        text: "Tamadas",
        next: 4
      },
      {
        text: "Menekules",
        next: 1
      }
    ]
  },

  3: {
    text: "Hazamentel. Vege a jateknak.",
    image: "images/end.jpg",
    choices: [
      {
        text: "Ujrakezdes",
        next: 1
      }
    ]
  },

  4: {
    text: "Legyozted az orkot es talaltal egy kardot.",
    image: "images/treasure.jpg",
    item: "Rozsdas Kard",
    choices: [
      {
        text: "Tovabb",
        next: 5
      }
    ]
  },

  5: {
    text: "Megtalaltad a kincset. Gyoztel!",
    image: "images/win.jpg",
    choices: [
      {
        text: "Uj jatek",
        next: 1
      }
    ]
  }
};

let player = {
  hp: 20,
  luck: 9,
  inventory: [],
  currentNode: 1
};

const storyText = document.getElementById("story-text");
const choicesContainer = document.getElementById("choices-container");
const hpText = document.getElementById("hp");
const luckText = document.getElementById("luck");
const inventoryText = document.getElementById("inventory");
const chapterImage = document.getElementById("chapter-image");

function saveGame() {
  localStorage.setItem("kjk_save", JSON.stringify(player));
}

function loadGame() {
  let save = localStorage.getItem("kjk_save");

  if (save) {
    player = JSON.parse(save);
  }
}

function updateGame() {
  let current = storyNodes[player.currentNode];

  storyText.innerText = current.text;

  chapterImage.src = current.image;

  hpText.innerText = player.hp;
  luckText.innerText = player.luck;

  if (player.inventory.length === 0) {
    inventoryText.innerText = "Ures";
  } else {
    inventoryText.innerText = player.inventory.join(", ");
  }

  choicesContainer.innerHTML = "";

  if (current.item) {
    if (!player.inventory.includes(current.item)) {
      player.inventory.push(current.item);
    }
  }

  current.choices.forEach(choice => {
    let button = document.createElement("button");

    button.innerText = choice.text;

    button.onclick = function () {

      if (current.enemy && choice.text === "Tamadas") {

        let enemyPower = Math.floor(Math.random() * 6) + 1;
        let playerPower = Math.floor(Math.random() * 6) + 3;

        if (playerPower >= enemyPower) {
          alert("Legyozted az orkot!");
        } else {
          player.hp -= 5;

          alert("Megsebesultel!");

          if (player.hp <= 0) {
            alert("Meghaltal!");

            restartGame();
            return;
          }
        }
      }

      player.currentNode = choice.next;

      saveGame();

      updateGame();
    };

    choicesContainer.appendChild(button);
  });
}

function restartGame() {
  localStorage.removeItem("kjk_save");

  player = {
    hp: 20,
    luck: 9,
    inventory: [],
    currentNode: 1
  };

  updateGame();
}

document.getElementById("restart-btn").onclick = restartGame;

loadGame();

updateGame();
<template>
  <div>
    <h2>
      Player <span v-if="isPlayerXTurn">X</span> <span v-else>O</span> Turn
    </h2>
    <div class="main">
      <div v-if="gameBoard" class="board">
        <div v-for="x in 3" :key="x" class="column">
          <div v-for="y in 3" :key="y">
            <button type="button" @click="clickCell(x, y)" class="item">
              {{ findLetter(x, y) }}
            </button>
          </div>
        </div>
      </div>
      <h3>Game Logs:</h3>
      <ul>
        <li>log 1</li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Index",
  data() {
    return {
      board: [],
      uid: null,
      game_id: null,
      isPlayerXTurn: true,
    };
  },
  created() {
    this.loadGame();
  },
  computed: {
    gameBoard() {
      return this.board;
    },
  },
  methods: {
    loadGame() {
      const uid = localStorage.getItem("game_uid");
      axios
        .get("game/" + uid)
        .then((response) => {
          const data = response.data.data;
          this.board = data.squares;
          this.uid = data.uid;
          this.game_id = data.id;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    clickCell(x, y) {
      let index = this.findIndex(x, y);
      console.log(index);
      if (this.board[index].isX === null) {
        const data = {
          x: x,
          y: y,
          isX: this.isPlayerXTurn,
          game_id: this.game_id,
          id: this.board[index].id,
        };
        axios
          .post("board/move", data)
          .then(() => {
            this.isPlayerXTurn = !this.isPlayerXTurn;
            this.loadGame();
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    findLetter(x, y) {
      if (this.gameBoard !== null) {
        const index = this.findIndex(x, y);
        if (index >= 0) {
          console.log(index);
          return this.board[index].isX === 1
            ? "X"
            : this.board[index].isX === 0
            ? "O"
            : "";
        }
      }
    },
    findIndex(x, y) {
      return this.board.findIndex(
        (element) => element.x === x && element.y === y
      );
    },
  },
};
</script>

<style>
.board {
  margin: auto;
  width: 400px;
  height: 400px;
  display: flex;
}
.item {
  display: block;
  padding: 5px;
  width: 125px;
  height: 125px;
  border: none;
  margin: 0.2rem;
}
.column {
  display: flex;
  flex-direction: column;
}
.main {
  margin: auto;
  max-width: 400px;
}
ul {
  text-align: left;
}
</style>

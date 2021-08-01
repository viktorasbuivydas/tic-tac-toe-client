<template>
  <div>
    <h2>
      Player <span v-if="isPlayerXTurn">X</span> <span v-else>O</span> Turn
    </h2>

    <div class="main">
      <div v-if="gameBoard" class="board">
        <div v-for="(item, index) in gameBoard" :key="index">
          <div class="column">
            <div>
              <button type="button" @click="clickSquare(index)" class="item">
                <span v-if="item.isX">X</span>
                <span v-else-if="item.isX === false">O</span>
                <span v-else></span>
                <small>x: {{ item.x }}; y: {{ item.y }}</small>
              </button>
            </div>
          </div>
        </div>
      </div>
      <h3>Game Logs:</h3>
      <ul v-for="(log, index) in gameLogs" :key="index">
        <li>{{ log.log }}</li>
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
      logs: [],
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
    gameLogs() {
      return this.logs;
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
          this.logs = data.logs;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    clickSquare(index) {
      const square = this.board[index];
      if (square.isX === null) {
        const data = {
          x: square.x,
          y: square.y,
          isX: this.isPlayerXTurn,
          game_id: this.game_id,
          id: square.id,
        };
        axios
          .post("board/move", data)
          .then((response) => {
            this.isPlayerXTurn = !this.isPlayerXTurn;
            const newSquare = response.data.data;
            this.board.splice(index, 1, newSquare);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    checkWinner() {},
  },
};
</script>

<style>
.board {
  margin: auto;
  width: 400px;
  height: 400px;
  display: flex;
  flex-wrap: wrap;
}
.item {
  display: block;
  padding: 5px;
  width: 125px;
  height: 125px;
  border: none;
  margin: 0.2rem;
  position: relative;
}
.item > small {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 0.5rem;
  font-size: 0.7rem;
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

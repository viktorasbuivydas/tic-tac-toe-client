<template>
  <div>
    <div v-if="gameBoard">
      <p><b-button variant="success" @click="restartGame">Restart</b-button></p>

      <h2>
        Player <span v-if="isPlayerXTurn">X</span> <span v-else>O</span> Turn
      </h2>
      <div class="main">
        <div class="board">
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
        <div v-if="gameLogs">
          <ul v-for="(log, index) in gameLogs" :key="index">
            <li>{{ log.log }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div v-else>
      <spinner size="medium" message="Loading..."></spinner>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Spinner from "vue-simple-spinner";
export default {
  name: "Index",
  components: {
    Spinner,
  },
  data() {
    return {
      board: [],
      uid: null,
      game_id: null,
      logs: [],
      isPlayerXTurn: null,
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
          this.isPlayerXTurn = data.isPlayerXTurn;
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
            const data = response.data.data;
            this.isPlayerXTurn = !this.isPlayerXTurn;
            const newSquare = data.square;
            const log = data.log;
            this.board.splice(index, 1, newSquare);
            this.logs.push(log);
          })
          .then(() => {
            this.checkWinner(index);
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    checkWinner(index) {
      this.isWinnerMove([true], index);
    },
    isWinnerMove(isPlayerX, index) {
      //var first = array[0];
      const board = this.board;
      const array = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        //columns
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        //diagnol
        [0, 4, 8],
        [2, 4, 6],
      ];
      console.log(isPlayerX);
      //let winner = null;
      let squareCount = 0;
      for (let i = 0; i < array.length; i++) {
        squareCount = 0;
        for (let j = 0; j < array[i].length; j++) {
          const mySquare = board[index].isX;
          if (mySquare === board[array[i][j]].isX) {
            squareCount++;
          } else {
            break;
          }
        }
        if (squareCount === 3) {
          console.log("win");
          console.log(array[i]);
          break;
        }
      }
    },
    restartGame() {
      this.board = null;
      this.logs = null;
      localStorage.removeItem("game_uid");

      axios
        .post("game/store")
        .then((response) => {
          const uid = response.data.data.uid;
          localStorage.setItem("game_uid", uid);
        })
        .then(() => {
          this.loadGame();
        })
        .catch((e) => {
          console.log(e);
        });
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

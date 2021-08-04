<template>
  <div>
    <div v-if="gameBoard">
      <div v-if="isFinished">
        Game over
      </div>
      <div v-else>
        <p>
          <b-button variant="success" @click="restartGame">Restart</b-button>
        </p>

        <h2>
          Player <span v-if="isPlayerXTurn">X</span> <span v-else>O</span> Turn
        </h2>
        <div class="main">
          <div class="board">
            <div v-for="(item, index) in gameBoard" :key="index">
              <div class="column">
                <div>
                  <button
                    type="button"
                    @click="clickSquare(index)"
                    class="item"
                  >
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
          <div v-if="gameLogs.length > 0">
            <ul v-for="(log, index) in gameLogs" :key="index">
              <li>{{ log.log }}</li>
            </ul>
          </div>
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
      isFinished: false,
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
      const self = this;
      Promise.all([
        this.getGame(uid, self),
        this.getBoard(uid, self),
        this.getLogs(uid, self),
      ])
        .then((response) => {
          const game = response[0].data.data;
          this.uid = game.uid;
          this.isPlayerXTurn = game.isPlayerXTurn;
          this.isFinished = game.isFinished;
          this.board = response[1].data.data;
          this.logs = response[2].data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async clickSquare(index) {
      const square = this.board[index];
      if (square.isX === null) {
        const data = {
          isX: this.isPlayerXTurn,
          square_id: square.id,
          square_index: index,
          uid: this.uid,
        };
        let board = await axios.put("boards/" + this.uid, data);
        const newSquare = board.data.data;
        this.isPlayerXTurn = !this.isPlayerXTurn;
        this.board.splice(index, 1, newSquare);
        const square_data = {
          isX: this.isPlayerXTurn,
          game_uid: this.uid,
          x: newSquare.x,
          y: newSquare.y,
        };
        await axios.post("actions", square_data);
        const logs = await axios.post("logs", square_data);
        this.logs = logs.data.log;
        //this.checkWinner(index);
      }
    },
    getGame(uid) {
      return axios.get("games/" + uid);
    },
    getBoard(uid) {
      return axios.get("boards/" + uid);
    },
    getLogs(uid) {
      return axios.get("logs/" + uid);
    },
    getActions() {},
    restartGame() {
      this.board = null;
      this.logs = null;
      localStorage.removeItem("game_uid");
      axios
        .post("games")
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

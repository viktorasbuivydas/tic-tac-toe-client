<template>
  <div>
    <div>
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
          <board />
          <h3>Game Logs:</h3>
          <div v-if="isLoading">
            <spinner size="medium" message="Loading..."></spinner>
          </div>
          <div v-else>
            <div v-if="gameLogs.length > 0">
              <ul v-for="(log, index) in gameLogs" :key="index">
                <li>{{ log.log }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Board from "../components/Board.vue";
export default {
  name: "Index",
  components: {
    Board,
  },
  data() {
    return {
      board: null,
      uid: null,
      game_id: null,
      logs: [],
      isPlayerXTurn: null,
      isFinished: false,
      isLoading: true,
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
      this.$store.dispatch("game/loadGame");
      this.$store.dispatch("board/loadGameBoard");
      this.$store.dispatch("logs/loadGameLogs");

      /*Promise.all([
        // this.getGame(uid, self),
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
          this.isLoading = false;
        })
        .catch((e) => {
          console.log(e);
          this.isLoading = false;
        });
        */
    },
    async clickSquare(index) {
      this.isLoading = true;
      const square = this.board[index];
      if (square.isX === null) {
        const data = {
          isX: this.isPlayerXTurn,
          square_id: square.id,
          square_index: index,
          uid: this.uid,
        };
        let board = await axios.put("boards/" + this.uid, data);
        const newSquare = board.data.data.square;
        this.board.splice(index, 1, newSquare);

        await axios.post("actions", {
          isX: this.isPlayerXTurn,
          game_uid: this.uid,
        });

        const logs = await axios.post("logs", {
          isX: this.isPlayerXTurn,
          game_uid: this.uid,
          x: newSquare.x,
          y: newSquare.y,
        });
        this.logs.push(logs.data.data);
        this.isPlayerXTurn = !this.isPlayerXTurn;
        this.isLoading = false;
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
    async restartGame() {
      this.board = null;
      this.logs = null;
      this.isLoading = true;
      localStorage.removeItem("game_uid");
      let response = await axios.post("games");
      const uid = response.data.data.uid;
      localStorage.setItem("game_uid", uid);
      let board = await axios.post("boards", { uid: uid });
      this.board = board.data.data.board;
      this.loadGame();
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

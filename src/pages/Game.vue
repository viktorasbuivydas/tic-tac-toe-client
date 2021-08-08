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
          <div>
            <div v-if="gameBoard === null && isLoading === true">
              <spinner size="medium" message="Loading..." />
            </div>
            <div v-else class="board">
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
          </div>
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
import Spinner from "vue-simple-spinner";

export default {
  name: "Index",
  components: {
    Spinner,
  },
  data() {
    return {
      board: null,
      game_uid: null,
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
      this.game_uid = localStorage.getItem("game_uid");
      this.isLoading = true;
      this.getGame(this.game_uid)
        .then((response) => {
          const data = response.data.data;
          this.game_uid = data.game_uid;
          this.isPlayerXTurn = data.isPlayerXTurn;
          this.isFinished = data.isFinished;
        })
        .then(() => {
          axios
            .get("boards/" + this.game_uid)
            .then((response) => {
              this.board = response.data.data;
            })
            .then(() => {
              axios.get("logs/" + this.game_uid).then((response) => {
                this.logs = response.data.data;
              });
            });
        })
        .catch((e) => {
          console.log(e);
          localStorage.removeItem("game_uid");
          this.$router.push({ name: "Index" });
        });
      this.isLoading = false;
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
      const game_uid = response.data.data.game_uid;
      localStorage.setItem("game_uid", game_uid);
      let board = await axios.post("boards", { game_uid: game_uid });
      this.board = board.data.data.board;
      this.loadGame();
    },
    async clickSquare(index) {
      this.isLoading = true;
      const square = this.board[index];
      if (square.isX === null) {
        const data = {
          isX: this.isPlayerXTurn,
          square_id: square.id,
          square_index: index,
          game_uid: this.game_uid,
        };
        let board = await axios.put("boards/" + this.game_uid, data);
        const newSquare = board.data.data;
        this.board.splice(index, 1, newSquare);

        await axios.post("actions", {
          isX: this.isPlayerXTurn,
          game_uid: this.game_uid,
        });

        const logs = await axios.post("logs", {
          isX: this.isPlayerXTurn,
          game_uid: this.game_uid,
          x: newSquare.x,
          y: newSquare.y,
        });
        this.logs.push(logs.data.data);
        this.isPlayerXTurn = !this.isPlayerXTurn;
        this.isLoading = false;
      }
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

<template>
  <div>
    <div>
      <div>
        <p>
          <b-button variant="success" @click="restartGame">Restart</b-button>
        </p>

        <h2>
          Player <span v-if="is_player_x_turn">X</span>
          <span v-else>O</span> Turn
        </h2>
        <div class="main">
          <div>
            <div v-if="gameBoard === null && is_loading === true">
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
                      <span v-if="item.is_x">X</span>
                      <span v-else-if="item.is_x === false">O</span>
                      <span v-else></span>
                      <small>x: {{ item.x }}; y: {{ item.y }}</small>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <h3>Game Logs:</h3>
          <div v-if="is_loading">
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
      is_Player_x_turn: null,
      is_finished: false,
      is_loading: true,
      winning_moves: [],
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
      this.checkWin();
      this.game_uid = localStorage.getItem("game_uid");
      this.is_loading = true;
      this.getGame(this.game_uid)
        .then((response) => {
          const data = response.data.data;
          this.game_uid = data.game_uid;
          this.is_player_x_turn = data.is_player_x_turn;
          this.is_finished = data.is_finished;
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
      this.is_loading = false;
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
    async clickSquare(index) {
      this.is_loading = true;
      const square = this.board[index];
      if (square.isX === null) {
        const data = {
          isX: this.is_player_x_turn,
          square_id: square.id,
          square_index: index,
          game_uid: this.game_uid,
        };
        let board = await axios.put("boards/" + this.game_uid, data);
        const newSquare = board.data.data;
        this.board.splice(index, 1, newSquare);

        await axios.post("actions", {
          isX: this.is_player_x_turn,
          game_uid: this.game_uid,
        });

        const logs = await axios.post("logs", {
          isX: this.is_player_x_turn,
          game_uid: this.game_uid,
          x: newSquare.x,
          y: newSquare.y,
        });
        this.logs.push(logs.data.data);
        this.is_player_x_turn = !this.is_player_x_turn;
        this.is_loading = false;
      }
      this.checkWin();
    },

    async restartGame() {
      this.board = null;
      this.logs = null;
      this.is_loading = true;
      localStorage.removeItem("game_uid");
      let response = await axios.post("games");
      const game_uid = response.data.data.game_uid;
      localStorage.setItem("game_uid", game_uid);
      let board = await axios.post("boards", { game_uid: game_uid });
      this.board = board.data.data.board;
      this.loadGame();
    },
    checkWin() {
      axios
        .put("games/" + this.game_uid)
        .then((response) => {
          console.log(response);
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

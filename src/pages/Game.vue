<template>
  <div>
    <div>
      <div>
        <p>
          <b-button variant="success" @click="restartGame">Restart</b-button>
        </p>
        <p>
          <router-link :to="{ name: 'Index' }">Go to homepage</router-link>
        </p>

        <div v-if="!isGameFinished">
          <h2>
            Player <span v-if="isPlayerXTurn">X</span>
            <span v-else>O</span> Turn
          </h2>
        </div>
        <div v-else class="green p-3 my-3">
          <h2>Game is finished!</h2>
        </div>
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
                      :class="{
                        green: winningMoves && winningMoves.includes(index),
                      }"
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
          <div class="my-3">
            <h3>Game Logs:</h3>
            <div v-if="is_loading">
              <spinner size="medium" message="Loading..."></spinner>
            </div>
            <div v-else>
              <div v-if="gameLogs && gameLogs.length > 0">
                <ul v-for="(log, index) in gameLogs" :key="index">
                  <li>{{ log.log }}</li>
                </ul>
              </div>
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
      game_id: null,
      logs: [],
      is_loading: true,
      game_uid: null,
      is_player_x_turn: true,
      game_status: {
        is_finished: false,
        winning_moves: [],
        is_winner_x: null,
      },
    };
  },
  mounted() {
    this.loadGame();
  },
  computed: {
    gameBoard() {
      return this.board;
    },
    gameLogs() {
      return this.logs;
    },
    isGameFinished() {
      return this.game_status.is_finished;
    },
    winningMoves() {
      return this.game_status.winning_moves;
    },
    isPlayerXTurn() {
      return this.is_player_x_turn;
    },
  },
  methods: {
    loadGame() {
      const game_uid = localStorage.getItem("game_uid");
      this.game_uid = game_uid;
      this.is_loading = true;
      this.getGame(game_uid);
      this.is_loading = false;
    },

    getGame(uid) {
      return axios
        .get("games/" + uid)
        .then((response) => {
          const data = response.data.data;
          this.game_status = data;
          this.game_uid = data.game_uid;
          this.is_player_x_turn = data.is_player_x_turn;
        })
        .then(() => {
          this.getBoard(this.game_uid);
        })
        .catch((e) => {
          console.log(e);
          localStorage.removeItem("game_uid");
          this.$router.push({ name: "Index" });
        });
    },

    getBoard(uid) {
      return axios
        .get("boards/" + uid)
        .then((response) => {
          console.log(response);
          this.board = response.data.data;
        })
        .then(() => {
          axios.get("logs/" + this.game_uid).then((response) => {
            this.logs = response.data.data;
          });
        });
    },

    async clickSquare(index) {
      if (!this.isGameFinished && !this.is_loading) {
        this.is_loading = true;
        const square = this.board[index];
        if (square.is_x === null) {
          const data = {
            is_x: this.isPlayerXTurn,
            square_id: square.id,
            square_index: index,
            game_uid: this.game_uid,
          };
          let board = await axios.put("boards/" + this.game_uid, data);
          const newSquare = board.data.data;
          this.board.splice(index, 1, newSquare);
          this.checkWin();

          await axios.post("actions", {
            x: newSquare.x,
            y: newSquare.y,
            is_x: this.isPlayerXTurn,
            game_uid: this.game_uid,
          });
          const logs = await axios.post("logs", {
            is_x: this.isPlayerXTurn,
            game_uid: this.game_uid,
            x: newSquare.x,
            y: newSquare.y,
          });
          this.is_player_x_turn = !this.is_player_x_turn;
          this.logs.push(logs.data.data);

          this.is_loading = false;
        }
      }
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
          const data = response.data;
          this.game_status = data;
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
.item:hover {
  background: #42b983;
  color: white;
  transition: 0.3s;
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
.green {
  background: #42b983;
  color: white;
}
a {
  text-decoration: none;
  font-weight: bold;
  color: #42b983;
}
a:hover {
  color: #42b983;
}
</style>

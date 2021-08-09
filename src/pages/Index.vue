<template>
  <div class="main">
    <h2>Tic-Tac-Toe Game</h2>
    <b-button variant="success" @click="newGame">Start</b-button>
    <div v-if="seeded_games" class="my-3">
      <h2>Seeded games</h2>
      <ul v-for="(game, index) in seeded_games" :key="index">
        <li class="">
          <p>{{ game.game_uid }}</p>
          <b-button variant="success" @click="load(game.game_uid)"
            >Load</b-button
          >
        </li>
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
      game_uid: null,
      seeded_games: [],
    };
  },
  created() {
    this.loadSeededGames();
  },
  methods: {
    newGame() {
      axios
        .post("games")
        .then((response) => {
          this.game_uid = response.data.data.game_uid;
        })
        .then(() => {
          axios.post("boards", { game_uid: this.game_uid });
          localStorage.setItem("game_uid", this.game_uid);
          this.$router.push({ name: "Game" });
        })
        .catch((e) => {
          console.log(e);
          localStorage.removeItem("game_uid");
        });
    },
    loadSeededGames() {
      axios
        .get("load")
        .then((response) => {
          this.seeded_games = response.data.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    load(game_uid) {
      localStorage.setItem("game_uid", game_uid);
      this.$router.push({ name: "Game" });
    },
  },
};
</script>

<style>
.main {
  max-width: 400px;
}
ul {
  text-align: center;
}
li {
  list-style: none;
  justify-content: space-between;
  display: flex;
}
</style>

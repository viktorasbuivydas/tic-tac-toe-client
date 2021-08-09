<template>
  <div>
    <h2>Tic-Tac-Toe Game</h2>
    <b-button variant="success" @click="newGame">Start</b-button>
    <div class="my-3">
      <h2>Seeded games</h2>
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
    };
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
  },
};
</script>

<style></style>

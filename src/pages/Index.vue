<template>
  <div>
    <h2>Tic-Tac-Toe Game</h2>
    <b-button variant="success" @click="startGame">Start</b-button>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "Index",
  data() {
    return {
      uid: null,
    };
  },
  created() {
    this.alreadyInGame();
  },
  methods: {
    async startGame() {
      let response = await axios.post("games");
      const uid = response.data.data.uid;
      let board = await axios.post("boards", { uid: uid });
      this.board = board.data.data.board;
      this.$router.push({ name: "Game" });
      localStorage.setItem("game_uid", uid);
    },
    alreadyInGame() {
      const uid = localStorage.getItem("game_uid");
      if (uid !== null) {
        axios
          .get("game/" + uid)
          .then(() => {
            this.$router.push({ name: "Game" });
          })
          .catch((e) => {
            console.log(e);
            localStorage.removeItem("game_uid");
          });
      }
    },
  },
};
</script>

<style></style>

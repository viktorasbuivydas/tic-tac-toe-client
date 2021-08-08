<template>
  <div>
    <h2>Tic-Tac-Toe Game</h2>
    <b-button variant="success" @click="startGame">Start</b-button>
  </div>
</template>

<script>
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
      this.$store.dispatch("game/startGame").then(() => {
        this.$store.dispatch("board/createGameBoard");
      });
    },
    alreadyInGame() {
      this.$store.dispatch("game/loadGame");
    },
  },
};
</script>

<style></style>

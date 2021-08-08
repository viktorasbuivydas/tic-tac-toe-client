<template>
  <div>
    <div v-if="board == null">
      <spinner size="medium" message="Loading..." />
    </div>
    <div class="board" v-else>
      <div v-for="(item, index) in board" :key="index">
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
  </div>
</template>
<script>
import Spinner from "vue-simple-spinner";

export default {
  name: "Board",
  components: {
    Spinner,
  },
  props: {
    board: {
      require: true,
      type: Array,
    },
    methods: {
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
    },
  },
};
</script>

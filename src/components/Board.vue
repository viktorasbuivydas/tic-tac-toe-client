<template>
  <div>
    <div v-if="board == null">
      <spinner size="medium" message="Loading..." />
    </div>
    <div class="board" v-else>
      <div v-for="(item, index) in gameBoard" :key="index">
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
  },
};
</script>

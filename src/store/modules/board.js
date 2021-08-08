import axios from "axios";
import * as types from "../mutation-types";

// state
export const state = {
  game_board: null,
};

// getters
export const getters = {
  game_board: (state) => state.game_board,
};

// mutations
export const mutations = {
  [types.SET_GAME_BOARD](state, game_board) {
    state.game_board = game_board;
  },
};

// actions
export const actions = {
  loadGameBoard({ commit, rootState }) {
    const uid = rootState.game.game_uid;
    return axios.get("boards/" + uid).then((response) => {
      commit(types.SET_GAME_BOARD, response.data.data);
    });
  },

  createGameBoard({ commit, rootState }) {
    const uid = rootState.game.game_uid;
    return axios.post("boards", { game_uid: uid }).then((response) => {
      commit(types.SET_GAME_BOARD, response.data.data);
    });
  },
};

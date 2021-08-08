import axios from "axios";
import * as types from "../mutation-types";

// state
export const state = {
  game_uid: null,
  isPlayerXTurn: null,
  isFinished: null,
};

// getters
export const getters = {
  game_uid: () => localStorage.getItem("game_uid"),
  isPlayerXTurn: (state) => state.isPlayerXTurn,
  isFinished: (state) => state.isFinished,
};

// mutations
export const mutations = {
  [types.SET_GAME_UID](state, uid) {
    let game_uid = localStorage.setItem("game_uid", uid);
    state.game_uid = game_uid;
  },

  [types.SET_IS_PLAYER_X_TURN](state, isPlayerXTurn) {
    state.isPlayerXTurn = isPlayerXTurn;
  },

  [types.SET_IS_FINISHED](state, isFinished) {
    state.isFinished = isFinished;
  },
};

// actions
export const actions = {
  loadGame({ commit, state }) {
    axios.get("games/" + state.game_uid).then((response) => {
      commit("SET_GAME_UID", response.data.data.uid);
      commit("SET_IS_PLAYER_X_TURN", response.data.data.isPlayerXTurn);
      commit("SET_IS_FINISHED", response.data.data.isFinished);
    });
  },

  startGame({ commit }) {
    axios.post("games").then((response) => {
      commit(types.SET_GAME_UID, response.data.data.uid);
    });
  },
};

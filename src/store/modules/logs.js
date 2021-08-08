import axios from "axios";
import * as types from "../mutation-types";

// state
export const state = {
  game_logs: [],
};

// getters
export const getters = {
  game_logs: (state) => state.game_logs,
};

// mutations
export const mutations = {
  [types.SET_GAME_LOGS](state, logs) {
    state.game_logs = logs;
  },
};

// actions
export const actions = {
  loadGameLogs({ commit, rootState }) {
    const uid = rootState.game.game_uid;
    return axios.get("logs/" + uid).then((response) => {
      commit(types.SET_GAME_LOGS, response.data.data);
    });
  },
};

import * as types from "../mutation-types";

// state
export const state = {
  isLoading: true,
};

// getters
export const getters = {
  isLoading: (state) => state.isLoading,
};

// mutations
export const mutations = {
  [types.START_LOADING](state) {
    state.isLoading = true;
  },

  [types.STOP_LOADING](state) {
    state.isLoading = false;
  },
};

// actions
export const actions = {
  startLoading({ commit }) {
    commit(types.START_LOADING);
  },

  stopLoading({ commit }) {
    commit(types.STOP_LOADING);
  },
};

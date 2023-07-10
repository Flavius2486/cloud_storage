import { createStore } from "vuex";

export default createStore({
  state: {
    isAuthenticated: false,
  },
  getters: {},
  mutations: {
    setAuthentication(state, data) {
      state.isAuthenticated = data.auth;
    },
  },
  actions: {},
  modules: {},
});

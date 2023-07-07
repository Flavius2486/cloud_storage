import { createStore } from "vuex";

export default createStore({
  state: {
    email: null,
    token: null,
  },
  getters: {},
  mutations: {
    setSession(state, data) {
      state.email = data.email;
      state.token = data.token;
    },
  },
  actions: {},
  modules: {},
});

import { createStore } from "vuex";

export default createStore({
  state: {
    isAuthenticated: false,
    dataReceived: false,
    freeMemory: 0,
    usedMemory: 0,
  },
  getters: {},
  mutations: {
    setAuthentication(state, data) {
      state.isAuthenticated = data.auth;
    },
    setMemoryStatus(state, data) {
      state.freeMemory = data.data.freeMemory;
      state.usedMemory = data.data.usedMemory;
    },
    setDataStatus(state, data) {
      state.dataReceived = data.state;
    },
  },
  actions: {},
  modules: {},
});

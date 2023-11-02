import { createStore } from "vuex";

export default createStore({
  state: {
    isAuthenticated: false,
    dataReceived: false,
    dashboardData: [],
    nestedData: [],
    deletedData: [],
    recentData: [],
    publicData: [],
    starredData: [],
    freeMemory: 0,
    usedMemory: 0,
  },
  getters: {},
  mutations: {
    setAuthentication(state, data) {
      state.isAuthenticated = data.auth;
    },
    setData(state, data) {
      state.dashboardData = data.data.dashboardData;
      state.folders = data.data.folders;
      state.deletedData = data.data.deletedData;
      state.recentData = data.data.recentData;
      state.publicData = data.data.publicData;
      state.starredData = data.data.starredData;
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

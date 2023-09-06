import { createStore } from "vuex";

export default createStore({
  state: {
    isAuthenticated: false,
    rootData: [],
    nestedData: [],
    deletedData: [],
    recentData: [],
    publicData: [],
    starredData: [],
  },
  getters: {},
  mutations: {
    setAuthentication(state, data) {
      state.isAuthenticated = data.auth;
    },
    setData(state, data) {
      state.rootData = data.data.rootData;
      state.folders = data.data.folders;
      state.deletedData = data.data.deletedData;
      state.recentData = data.data.recentData;
      state.publicData = data.data.publicData;
      state.starredData = data.data.starredData;
    },
  },
  actions: {},
  modules: {},
});

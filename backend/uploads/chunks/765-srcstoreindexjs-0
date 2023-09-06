import { createStore } from "vuex";

export default createStore({
  state: {
    isAuthenticated: false,
    notNestedFiles: [],
    // nestedFiles: [],
    deletedFiles: [],
    recentFiles: [],
    publicFiles: [],
    starredFiles: [],
  },
  getters: {},
  mutations: {
    setAuthentication(state, data) {
      state.isAuthenticated = data.auth;
    },
    setData(state, data) {
      state.notNestedFiles = data.data.notNestedFiles;
      state.nestedFiles = data.data.nestedFiles;
      state.deletedFiles = data.data.deletedFiles;
      state.recentFiles = data.data.recentFiles;
      state.publicFiles = data.data.publicFiles;
      state.starredFiles = data.data.starredFiles;
    },
  },
  actions: {},
  modules: {},
});

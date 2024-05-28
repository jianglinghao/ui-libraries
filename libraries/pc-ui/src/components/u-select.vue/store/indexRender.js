export default {
  state: {
    dataSource: [],
  },
  mutations: {
    setRenderDataSource(state, value) {
      state.dataSource = value;
    },
    updateDataSource(state, value) {
      state.dataSource = value;
    },
  },
};

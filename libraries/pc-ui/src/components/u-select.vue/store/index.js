class PluginManage {
  dispath = null;

  watch(handle) {
    this.dispath = handle;
  }
}

const pluginManage = new PluginManage();
const watch = pluginManage.watch.bind(pluginManage);

export { watch };
export default {
  state: {
    dataSource: [],
  },
  mutations: {
    setDataSource(state, value) {
      state.dataSource = value;
    },
    updateDataSource(state, value) {
      state.dataSource = value;
    },
  },
  plugins: [
    (store) => {
      store.subscribe((mutation, state) => {
        if (mutation.type === 'setDataSource') {
          pluginManage.dispath?.(store, state);
        }
      });
    },
  ],
};

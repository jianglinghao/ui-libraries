import { watch } from '../store/index';

watch(
  (store, state) => {
    const { dataSource } = state.selectModule;
    const selfDataSource = dataSource.map((item) => ({
      ...item,
      text: `plugin_${item.text}`,
    }));
    store.commit('updateDataSource', selfDataSource);
  },
  ['dataSource'],
);

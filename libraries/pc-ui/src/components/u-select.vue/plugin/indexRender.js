import Vue from 'vue';

Vue.component('wrap-select', {
  props: ['dataSource'],
  inject: {
    injectDataSouce: {
      from: 'dataSource',
      default: [],
    },
  },
  computed: {
    stateDataSource() {
      return this.injectDataSouce.map((item) => ({
        ...item,
        text: `plugin_${item.text}`,
      }));
    },
  },
  provide() {
    return {
      dataSource: this.stateDataSource,
    };
  },
  mounted() {
    console.log(this.dataSource, this.injectDataSouce, 'wrap-selectLog');
  },
  render() {
    return this.$slots.default;
  },
});

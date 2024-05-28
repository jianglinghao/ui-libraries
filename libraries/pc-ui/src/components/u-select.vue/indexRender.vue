<template>
  <handle-select :dataSource="dataSource"></handle-select>
</template>
<script>
import Vue from 'vue';
import Vuex, { createNamespacedHelpers } from 'vuex';
import Select from './index.vue';
import store from '@/store';
import DataSource from '../../utils/DataSource/index.js';
Vue.use(Vuex);

Vue.component('handle-select', {
  store,
  component: {
    'u-select': Select,
  },
  props: {
    dataSource: [DataSource, Function, Object, Array],
  },
  computed: {
    stateDataSource() {
      return this.$store.state.selectRenderModule.dataSource.map((item) => ({
        ...item,
        text: `handle${item.text}`,
      }));
    },
  },
  watch: {
    dataSource: {
      handler: function (val) {
        console.log(val, 'datarender');
        store.commit('setRenderDataSource', val);
      },
      immediate: true,
    },
  },
  provide: function () {
    return {
      dataSource: this.stateDataSource,
    };
  },
  render(h, ctx) {
    return h('wrap-select', { attrs: this.$props }, [
      h('convert-select', { attrs: this.$props }, this.$slots.default),
    ]);
  },
});

Vue.component('wrap-select', {
  props: ['dataSource'],
  render(h, ctx) {
    return this.$slots.default;
  },
});

Vue.component('convert-select', {
  props: ['value', 'name'],
  inject: ['dataSource'],
  render(h) {
    return h(
      'u-select',
      { attrs: { dataSource: this.dataSource } },
      this.$slots.default,
    );
  },
});

export default {
  component: {
    'u-select': Select,
  },
  props: {
    dataSource: [DataSource, Function, Object, Array],
  },
};
</script>

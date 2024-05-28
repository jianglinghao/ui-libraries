<template>
  <div>
    <button>12</button>
    <u-select :dataSource="stateDataSource">
      <slot></slot>
    </u-select>

  </div>
</template>
<script>
import Vue from 'vue';
import Vuex, { createNamespacedHelpers } from 'vuex';
import Select from './index.vue';
import store from '@/store';
import DataSource from '../../utils/DataSource/index.js';
Vue.use(Vuex);
export default {
  name: 'my-select',
  store,
  component: {
    'u-select': Select,
  },
  props: {
    dataSource: [DataSource, Function, Object, Array],
  },
  computed: {
    stateDataSource() {
      return this.$store.state.selectModule.dataSource;
    },
  },

  watch: {
    dataSource: {
      handler: function (val) {
      console.log(val,'data');
        store.commit('setDataSource', val);
      },
      immediate: true,
    },
  },
};
</script>

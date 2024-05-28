import Vue from 'vue';
import Vuex from 'vuex';
import '../components/u-select.vue/plugin/index';
import selectModule from '../components/u-select.vue/store';
import selectRenderModule from '../components/u-select.vue/store/indexRender';

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    selectModule,
    selectRenderModule,
  },
  plugins: selectModule.plugins,
});

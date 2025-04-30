import Vue from 'vue'
import Vuex from 'vuex'
import cabinet from './modules/cabinet'

Vue.use(Vuex)

// noinspection JSUnresolvedFunction
export default new Vuex.Store({
  modules: {
    cabinet
  },

  strict: process.env.NODE_ENV !== 'production'
})

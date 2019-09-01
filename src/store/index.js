import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo: {},
    snaps: [],
    point: { x: 0, y: 0 },
    vData: {},
    commentId: '',
    hideComment: true,
    currentTime: '',
    operationType: '',
    FPS: ''
  },
  mutations,
  actions
})

export default {
  namespaced: true,
  state: {
    token: ''
  },
  mutations: {
    updateToken (state, val) {
      state.token = val
    }
  }
}

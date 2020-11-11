export default {
  install (Vue, options) {
    Vue.prototype.$sleep = function (ms = 3000) {     
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  },
}

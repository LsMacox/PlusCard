export default {
  install (Vue, options) {
    Vue.mixin({
      beforeCreate () {
        const constants = this.$options.constants
        if (!constants) return

        for (const key in constants) {
          if (Object.prototype.hasOwnProperty.call(constants, key)) {
            this[key] = Object.freeze(constants[key])
          }
        }
      },
    })
  },
}

var STORAGE = window.localStorage
var VueSession = {
  key: 'vue-session-key',
  setAll: function (all) {
    STORAGE.setItem(this.key, JSON.stringify(all))
  },
  getAll: function () {
    var all = JSON.parse(STORAGE.getItem(VueSession.key))
    return all || {}
  },
  set: function (key, value) {
    if (key === 'session-id') return false
    var all = this.getAll()

    if (!('session-id' in all)) {
      this.start()
      all = this.getAll()
    }

    all[key] = value

    VueSession.setAll(all)
  },
  get: function (key) {
    var all = this.getAll()
    return all[key]
  },
  start: function () {
    this.destroy()
    var all = this.getAll()
    all['session-id'] = Date.now()

    VueSession.setAll(all)
  },
  exists: function () {
    var all = this.getAll()
    return 'session-id' in all
  },
  has: function (key) {
    var all = this.getAll()
    return key in all
  },
  remove: function (key) {
    var all = this.getAll()
    delete all[key]

    VueSession.setAll(all)
  },
  clear: function () {
    var all = this.getAll()

    VueSession.setAll({ 'session-id': all['session-id'] })
  },
  destroy: function () {
    VueSession.setAll({})
  },
  id: function () {
    return this.get('session-id')
  },
}

VueSession.install = function (Vue) {
  Vue.prototype.$session = VueSession
}

module.exports = VueSession

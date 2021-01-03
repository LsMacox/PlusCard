import Vue from 'vue'

import MessageBoxComponent from './MessageBox.vue'

function isVNode () {
    return false
}

const merge = Object.assign

  const defaults = {
    vAppId: 'vApp',
    id: 'msgBoxMain',
    title: null,
    message: '',
    type: '',

    showInput: false,
    showClose: true,

    closeOnClickModal: true,
    closeOnPressEscape: true,
    closeOnHashChange: true,
    inputValue: null,
    inputPlaceholder: '',
    inputType: 'text',
    inputRules: null,

    showConfirmButton: true,
    showCancelButton: false,

    confirmButtonText: 'OK',
    cancelButtonText: '',
    confirmButtonClass: '',
    cancelButtonClass: '',
    customClass: '',
    beforeClose: null,

  }

  const MessageBoxConstructor = Vue.extend(MessageBoxComponent)

  let currentMsg, instance
  let msgQueue = []

  const defaultCallback = action => {
    if (currentMsg) {
      const callback = currentMsg.callback
      if (typeof callback === 'function') {
        if (instance.showInput) {
          callback(instance.inputValue, action)
        } else {
          callback(action)
        }
      }
      if (currentMsg.resolve) {
        if (action === 'confirm') {
          if (instance.showInput) {
            currentMsg.resolve({ value: instance.inputValue, action })
          } else {
            currentMsg.resolve(action)
          }
        } else if (currentMsg.reject && (action === 'cancel' || action === 'close')) {
          currentMsg.reject(action)
        }
      }
    }
  }

  const initInstance = () => {
      // console.log('initInstance')

      instance = new MessageBoxConstructor({
        el: document.createElement('div'),
      })

    instance.callback = defaultCallback
  }

  const showNextMsg = () => {
    // console.log('showNextMsg')
    if (!instance) {
      initInstance()
    }
    instance.action = ''

    // console.log('instance.dialog', instance.dialog, msgQueue)
    if (!instance.dialog) {
      if (msgQueue.length > 0) {
        currentMsg = msgQueue.shift()

        const options = currentMsg.options
        for (const prop in options) {
          if (Object.prototype.hasOwnProperty.call(options, prop)) {
            instance[prop] = options[prop]
          }
        }
        if (options.callback === undefined) {
          instance.callback = defaultCallback
        }

        const oldCb = instance.callback
        instance.callback = (action, instance) => {
          oldCb(action, instance)
          showNextMsg()
        }
        if (isVNode(instance.message)) {
          instance.$slots.default = [instance.message]
          instance.message = null
        } else {
          delete instance.$slots.default
        }
        ['modal', 'showClose', 'closeOnClickModal', 'closeOnPressEscape', 'closeOnHashChange'].forEach(prop => {
          if (instance[prop] === undefined) {
            instance[prop] = true
          }
        })
        // console.log('appendChild, vAppId=', options.vAppId)

        const vApp = document.getElementById(options.vAppId)
        if (vApp) {
            // console.log('appendChild.vApp')
            // vApp.appendChild(instance.$el)
            instance.$mount(vApp)
        } else {
            document.body.appendChild(instance.$el)
        }

        Vue.nextTick(() => {
          instance.dialog = true
        })
      }
    }
  }

  const MessageBox = function (options, callback) {
    if (Vue.prototype.$isServer) return
    if (typeof options === 'string' || isVNode(options)) {
      options = {
        message: options,
      }
      if (typeof arguments[1] === 'string') {
        options.title = arguments[1]
      }
    } else if (options.callback && !callback) {
      callback = options.callback
    }

    if (typeof Promise !== 'undefined') {
      return new Promise((resolve, reject) => { // eslint-disable-line
        msgQueue.push({
          options: merge({}, defaults, MessageBox.defaults, options),
          callback: callback,
          resolve: resolve,
          reject: reject,
        })

        showNextMsg()
      })
    } else {
      msgQueue.push({
        options: merge({}, defaults, MessageBox.defaults, options),
        callback: callback,
      })

      showNextMsg()
    }
  }

  MessageBox.setDefaults = defaults => {
    MessageBox.defaults = defaults
  }

  MessageBox.alert = (message, title, options) => {
    if (typeof title === 'object') {
      options = title
      title = ''
    } else if (title === undefined) {
      title = ''
    }
    return MessageBox(merge({
      title: title,
      message: message,
      $type: 'alert',
      closeOnPressEscape: false,
      closeOnClickModal: false,
    }, options))
  }

  MessageBox.confirm = (message, title, options) => {
    if (typeof title === 'object') {
      options = title
      title = ''
    } else if (title === undefined) {
      title = ''
    }

    const config = merge({
        title: title,
        message: message,
        $type: 'confirm',
        showCancelButton: true,
      }, options)
      // console.log('confirm config', config)
    return MessageBox(config)
  }

  MessageBox.prompt = (message, title, options) => {
    if (typeof title === 'object') {
      options = title
      title = ''
    } else if (title === undefined) {
      title = ''
    }
    return MessageBox(merge({
      title: title,
      message: message,
      showCancelButton: true,
      showInput: true,
      $type: 'prompt',
    }, options))
  }

  MessageBox.close = () => {
    instance.doClose()
    instance.dialog = false
    msgQueue = []
    currentMsg = null
  }

  MessageBox.install = (Vue, settings) => {
    // console.log(' MessageBox.install', settings)
    // const inBrowser = typeof window !== 'undefined'

    if (settings) {
        MessageBox.setDefaults(settings)
    }

    Vue.prototype.$alert = MessageBox.alert
    Vue.prototype.$confirm = MessageBox.confirm
  }

  export default MessageBox
  export { MessageBox }

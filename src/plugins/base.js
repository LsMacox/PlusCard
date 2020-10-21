import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireComponent = require.context(
  '@/components/base', true, /\.vue$/,
)

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)

  const componentName = upperFirst(
    camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')),
  ).replace('Base', '')
  // console.log('install component:', `Base${componentName}`)
  Vue.component(`Base${componentName}`, componentConfig.default || componentConfig)
})

Vue.component('BaseMessageBox', import('@/components/message-box/MessageBox.vue'))

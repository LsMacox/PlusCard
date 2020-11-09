import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'

const requireBaseComponent = require.context(
  '@/components/base', true, /\.vue$/,
)

const requireExtendedComponent = require.context(
  '@/components/extended', true, /\.vue$/,
)

// folder
installComponents(requireBaseComponent, 'base')
installComponents(requireExtendedComponent, 'extended')
// manually
Vue.component('BaseMessageBox', import('@/components/message-box/MessageBox.vue'))


function installComponents(requireCtx, type) {
  requireCtx.keys().forEach(fileName => {
  const componentConfig = requireCtx(fileName)
  const componentName = prepareComponentName(fileName)

  if (type.toLowerCase() == 'default' || !type.length) type = ''
    
  Vue.component(upperFirst(type) + componentName, componentConfig.default || componentConfig)
})
}

function prepareComponentName(fileName) {
  let componentName = upperFirst(
    camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')),
  )

  componentName = componentName.replace('Base', '').replace('Extended', '')

  return componentName
}
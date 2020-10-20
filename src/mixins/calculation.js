export default {
  methods: {
    nodeOffsetWH(node, wh = true) {
      const clone = node.cloneNode(true)
      clone.setAttribute('style', 'display:block !important');
      clone.style.visibility = 'hidden'
      node.parentNode.append(clone)

      const offsetW = clone.offsetWidth
      const offsetH = clone.offsetHeight

      clone.remove()

      if (wh) {
        return offsetW
      } else {
        return offsetH
      }
    },
    findSidePanelComponent(vm) {
      let _vm_ = vm
      while (true) {
        if (typeof _vm_.$refs !== 'undefined' &&
          Object.keys(_vm_.$refs).includes('side-panel')) {
          break
        } else if (typeof _vm_.$parent !== 'undefined') {
          _vm_ = _vm_.$parent
        } else {
          _vm_ = undefined
          break
        }
      }

      return _vm_
    },
    calculationPositionEl(posEl, relEl) {
      const sidePanelEl = this.findSidePanelComponent(this) || undefined 
      const sidePanelContent = sidePanelEl.$refs['side-panel__nav'].$el.querySelector('.v-navigation-drawer__content') || undefined
      const posElHeight = this.nodeOffsetWH(posEl, false)

      this.$nextTick(() => {
        const relElPosY = ((relEl.offsetTop) + relEl.clientHeight)
        const distanceBelow = (typeof sidePanelContent !== 'undefined')
          ? sidePanelContent.scrollHeight - relElPosY
          : document.body.scrollHeight - relElPosY

        if (posElHeight >= distanceBelow) {
          posEl.style.top = 'inherit'
          posEl.style.bottom = relEl.clientHeight + 'px'
          this.listPlacement = 'top'
        } else {
          posEl.style.bottom = 'inherit'
          posEl.style.top = relEl.clientHeight + 'px'
          this.listPlacement = 'bottom'
        }
      })
    }
  }
}

import {VSkeletonLoader} from 'vuetify/lib';

const Skeleton = Vue.extend(VSkeletonLoader);

const loadingDirective = {};
loadingDirective.install = Vue => {
  if (Vue.prototype.$isServer) return;

  Vue.directive('loading', {
    bind: function(el, binding, vnode) {
        console.log('loading bind', binding)
    //   const textExr = el.getAttribute('element-loading-text');
    //   const spinnerExr = el.getAttribute('element-loading-spinner');
    //   const backgroundExr = el.getAttribute('element-loading-background');
    //   const customClassExr = el.getAttribute('element-loading-custom-class');
      const vm = vnode.context;
      var skeleton = new Skeleton({
        el: document.createElement('div'),
        propsData: { 
           loading: binding.value, 
           type: "image",
        }
      });
      skeleton.$slots.default = [el] 

      
      skeleton.original = el;
      el = skeleton      
    //   el.maskStyle = {};

    //   binding.value && toggleLoading(el, binding);
    },

    update: function(el, binding) {
        console.log('loading update', binding)
    //   el.instance.setText(el.getAttribute('element-loading-text'));
    //   if (binding.oldValue !== binding.value) {
    //     toggleLoading(el, binding);
    //   }
    },

    unbind: function(el, binding) {
        console.log('loading unbind', binding)
    //   if (el.domInserted) {
    //     el.mask &&
    //     el.mask.parentNode &&
    //     el.mask.parentNode.removeChild(el.mask);
    //     toggleLoading(el, { value: false, modifiers: binding.modifiers });
    //   }
    //   el.instance && el.instance.$destroy();
    }
  });
};
}



export default loadingDirective;
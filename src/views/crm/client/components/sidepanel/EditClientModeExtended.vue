<template>
  <div>
    <keep-alive>
      <component
        :is="activeTab.componentName"
        :client-data="clientData"
      />
    </keep-alive>
  </div>
</template>

<script>
  import TabClient from './tabs/TabClient'
  import TabDocument from './tabs/TabDocument'
  import TabMap from './tabs/TabMap'
  import TabOperation from './tabs/TabOperation'

  export default {
    components: {
      TabClient,
      TabDocument,
      TabMap,
      TabOperation,
    },
    props: {
      clientData: {
        type: Object,
        default: () => {
          return {}
        },
      },
      tabs: {
        type: Array,
        default () {
          return []
        },
      },
    },
    data () {
      return {}
    },
    computed: {
      activeTab () {
        return this.tabs.filter(tab => tab.active)[0]
      },
    },
    methods: {
    },
  }
</script>

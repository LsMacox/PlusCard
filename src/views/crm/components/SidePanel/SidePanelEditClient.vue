<template>
  <side-panel
    v-model="state"
    :width="483"
    class="panel-crm panel-crm_edit_client"
  >
    <div class="panel-crm__header panel-crm_edit_client__header">
      <div class="panel-crm_edit_client__tabs">
        <v-btn
          class="panel-crm_edit_client__tabs-btn"
          color="primary"
          @click="mode = false"
        >
          Обычный
        </v-btn>
        <v-btn
          class="panel-crm_edit_client__tabs-btn"
          color="primary-100"
          @click="mode = true"
        >
          Расширенный
        </v-btn>
      </div>
    </div>
    <div class="panel-crm__body panel-crm_edit_client__body" />
  </side-panel>
</template>

<script>
  import Convertor from '@/mixins/convertor.js'
  import SidePanel from '@/components/base/SidePanel'

  export default {
    components: {
      SidePanel,
    },
    mixins: [Convertor],
    model: {
      prop: 'active',
      event: 'changeState',
    },
    props: {
      active: {
        type: Boolean,
      },
      clientData: {
        type: Object,
        default: () => {
          return {
            id: '103112',
            gender: true,
            date_of_birth: '10.03.1990',
            city: 'Новокузнецк',
            name: 'Константин',
            surname: 'Константинопольский',
            online: '02.08.2020 04:32',
            phone: '79832525202',
            email: 'rs.bikeev@yandex.ru',
            code: '1640000000145437',
            card: '432156',
            img_avatar: '@/assets/png/custom/beardedman.png',
          }
        },
      },
    },
    data () {
      return {
        mode: false, // false = usual, true = extended
        state: this.active,
      }
    },
    computed: {},
    watch: {
      active () {
        this.state = this.active
      },
      state () {
        this.$emit('changeState', this.state)
      },
    },
    created () {
    },
    mounted () {
    },
    methods: {
    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/crm/components/side_panels/_side-panel-edit-client.scss";

</style>

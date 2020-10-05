<template>
  <div>
    <empty-client
      v-if="!clients.length"
    />
    <base-table
      v-if="clients.length"
      class-name="table-segment"
      :headers="tableHeaders"
      :data="clients"
      @click:row="editSidePanel"
    >
      <template v-slot:[`item.id`]="{ item }">
        <p class="body-s-medium mb-0">
          {{ item.id }}
        </p>
      </template>
      <template v-slot:[`item.segment-name`]="{ item }">
        <p
          class="body-s-semibold mb-0"
          style="display: inline-block; padding: 4px 8px 4px 8px; border-radius: 4px;"
          :style="item.color != undefined ? `color: ${item.color}; background: ${hexToRgbA(item.color, '0.15')}` : ''"
        >
          {{ item.name }}
        </p>
      </template>
      <template v-slot:[`item.client`]="{ item }">
        <p class="body-s-medium mb-0">
          {{ item.clients_count ? item.clients_count : 0 }}
        </p>
      </template>
      <template v-slot:[`item.profit`]="{ item }">
        <p class="body-s-medium mb-0">
          <!--          {{ item.profit | spacesBetweenNumbers }} ₽-->
          -
        </p>
      </template>
      <template v-slot:[`item.average-check`]="{ item }">
        <p class="body-s-medium mb-0">
          <!--          {{ item.average_check | spacesBetweenNumbers }} ₽-->
          -
        </p>
      </template>
      <template v-slot:[`item.client-cost`]="{ item }">
        <p class="body-s-medium mb-0">
          <!--          {{ item.client_cost | spacesBetweenNumbers }} ₽-->
          -
        </p>
      </template>
      <template v-slot:[`item.data-table-expand`]>
        <v-icon
          color="neutral-500"
          size="11"
        >
          fas fa-chevron-right
        </v-icon>
      </template>
    </base-table>
    <side-panel-edit-client
      v-model="sidePanelStatus.active"
      :mode="sidePanelStatus.mode"
      :table-data="sidePanelStatus.data"
    />
  </div>
</template>

<script>
  import EmptyClient from '@/views/crm/components/EmptyClient'
  import SidePanelEditClient from './SidePanel/SidePanelEditClient'
  import BaseTable from '@/components/base/BaseTable'
  import Convertor from '@/mixins/convertor'

  export default {
    components: {
      EmptyClient,
      SidePanelEditClient,
      BaseTable,
    },
    mixins: [Convertor],
    data () {
      return {
        loadingList: false,
        sidePanelStatus: {
          active: false,
          mode: 'create',
          data: null,
        },
        tableHeaders: [
          { text: 'ID', align: 'start', value: 'id' },
          { text: 'Название сегмента', align: 'start', value: 'segment-name' },
          { text: 'Клиенты', align: 'end', value: 'client' },
          { text: 'Доход', align: 'end', value: 'profit' },
          { text: 'Средний чек', align: 'end', value: 'average-check' },
          { text: 'Клиент стоит', align: 'end', value: 'client-cost' },
          { text: '', align: 'end', value: 'data-table-expand' },
        ],
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
      clients () {
        return this.$store.getters['crm/client/clients']
      },
    },
    watch: {
      program (v) {
        if (v) this.fetchData()
      },
    },
    created () {
    // this.segmentsData = this.$store.getters['crm/segment/segments']
    },
    mounted () {
      this.fetchData()
    },
    methods: {
      createSidePanel (item) {
        this.sidePanelStatus.mode = 'create'
        this.sidePanelStatus.data = null
        this.sidePanelStatus.active = true
      },
      editSidePanel (item) {
        this.sidePanelStatus.mode = 'edit'
        this.sidePanelStatus.data = item
        this.sidePanelStatus.active = true
      },
      fetchData () {
        this.loadingList = true
        const payload = {
          program_id: this.program.id,
        }
        try {
          this.$store.dispatch('crm/client/list', payload)
        } finally {
          this.loadingList = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";
</style>

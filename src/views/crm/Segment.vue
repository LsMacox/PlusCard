<template>
  <div class="crm b-segment">
    <div
      v-if="Boolean(segmentsData.length)"
      class="crm__header b-segment__header"
    >
      <p class="crm__header-title title-m-bold neutral-900--text">
        Сигменты
      </p>
      <v-btn
        class="crm__header_new-btn"
        color="primary"
        @click="createSidePanel"
      >
        <iconify-icon
          icon="plus-circle"
          width="21"
        />
        <p
          class="body-m-semibold neutral-100--text"
        >
          Новый сигмент
        </p>
      </v-btn>
    </div>
    <empty-segment
      v-if="!segmentsData.length"
      :side-panel-status.sync="sidePanelStatus"
    />
    <base-table
      v-if="Boolean(segmentsData.length)"
      class-name="table-segment"
      :headers="tableHeaders"
      :data="segmentsData"
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
          :style="item.label_color != undefined ? `color: ${item.label_color}; background: ${hexToRgbA(item.label_color, '0.15')}` : ''"
        >
          {{ item.name }}
        </p>
      </template>
      <template v-slot:[`item.client`]="{ item }">
        <p class="body-s-medium mb-0">
          {{ item.client_count | spacesBetweenNumbers }}
        </p>
      </template>
      <template v-slot:[`item.profit`]="{ item }">
        <p class="body-s-medium mb-0">
          {{ item.profit | spacesBetweenNumbers }} ₽
        </p>
      </template>
      <template v-slot:[`item.average-check`]="{ item }">
        <p class="body-s-medium mb-0">
          {{ item.average_check | spacesBetweenNumbers }} ₽
        </p>
      </template>
      <template v-slot:[`item.client-cost`]="{ item }">
        <p class="body-s-medium mb-0">
          {{ item.client_cost | spacesBetweenNumbers }} ₽
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
    <side-panel-segment
      v-model="sidePanelStatus.active"
      :mode="sidePanelStatus.mode"
      :table-data="sidePanelStatus.data"
    />
  </div>
</template>

<script>
  import EmptySegment from './components/EmptySegment'
  import SidePanelSegment from './components/SidePanel/SidePanelSegment'
  import BaseTable from '@/components/base/BaseTable'
  import Convertor from '@/mixins/convertor'

  export default {
    components: {
      EmptySegment,
      SidePanelSegment,
      BaseTable,
    },
    mixins: [Convertor],
    data () {
      return {
        segmentsData: null,
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
    computed: {},
    watch: {},
    created () {
      this.segmentsData = this.$store.getters['crm/segment/segments']
    },
    mounted () {},
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
    },
  }
</script>

<style lang="scss">

@import "@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";

</style>

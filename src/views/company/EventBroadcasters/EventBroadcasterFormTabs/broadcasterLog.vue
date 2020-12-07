<template>
  <BaseDrawerDialog
    v-model="dialog"
    title="Срабатывания активности клиентов"
    width="700px"
  >
    <v-skeleton-loader
      :loading="GetBroadcasterLogAction"
      :style="{ height: '100%', width: '100%' }"
      type="card-heading, image@3"
    >
      <v-container
        fluid
        class=""
      >
        <v-row
          justify="space-between"
          align="center"
        >
          <v-col
            cols="6"
            sm="12"
            md="6"
          >
            <v-row>
              <v-col>
                <base-text-field
                  v-model.trim="search"
                  :prepend-inner-icon="'$iconify_search-outlined'"
                  placeholder="Быстрый поиск"
                  style="min-width: 225px"
                  escape-clearable
                  hide-details
                  clearable
                />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <base-table
              :headers="headers"
              :data="filtered_list"
              :is-custom-header="false"
              :total-count="filtered_list.length"
              :word-operations="['событие', 'события', 'событий']"
              :pagination="{
                sortBy: 'created_at',
                descending: 'descending',
              }"
               :expanded.sync="expanded"
              :search="search_comp"
              show-expand
            >
              <template v-slot:[`item.createdAtFormat`]="{ item }">
                <date-column :value="item.created_at" />
              </template>

              <template v-slot:[`item.account`]="{ item }">
                <account-column :value="item.account" />
              </template>
              <template v-slot:[`item.result`]="{ item }">
                <span v-if="false">{{ item.totalCount }}:</span> <span class="success--text">{{ item.successCount }}</span>/</span> <span class="error--text">{{ item.failCount }}</span>
              </template>
              <template v-slot:item.expanded-item="{ expand, isExpanded }">
                <td :colspan="headers.length">
                  More info about {{ item.id }}
                </td>
              </template>

            <!-- </v-data-table> -->
            </base-table>
          </v-col>
        </v-row>
      </v-container>
    </v-skeleton-loader>
  </BaseDrawerDialog>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  import ProgramEventBroadcaster from '@/models/program/broadcaster'
  import ProgramEventBroadcasterEventProcess from '@/models/program/broadcasterEventProcess'
  import dialogable from '@/mixins/dialogable.js'
  import { config } from '@/config'
  import Vue from 'vue'

  export default {
    components: {
      DateColumn: () => import('@/components/colums/DateColumn.vue'),
      AccountColumn: () => import('@/components/colums/AccountColumn.vue'),
    },
    mixins: [dialogable],
    props: {
      broadcasterId: {
        type: Number,
        required: true,
      },
    },

    data () {
      return {
        search: '',
        GetBroadcasterLogAction: false,
        eventList: [],
        expanded: [],
        headers: [
          { text: 'ID', align: 'start', value: 'id', width: '7em' },
          { text: 'Дата', value: 'createdAtFormat' },
          { text: 'Клиент', value: 'account' },
          { text: 'Обработка', value: 'result' },
        ],
        processHeaders: [
          { text: 'ID', align: 'start', value: 'id', width: '7em' },
          { text: 'Дата', value: 'created_at' },
          { text: 'Действие', value: 'action_type' },
          { text: 'Статус', value: 'status' },
        ],
      }
    },
    computed: {
      eventListMaped () {
        return this.eventList.map(item => {
          Vue.set(item, 'createdAtFormat', this.$moment.utc(item.created_at).local().format(config.date.DATETIME_FORMAT))
          const totalCount = item.event_process.length
          const successCount = item.event_process.filter(p => p.status === ProgramEventBroadcasterEventProcess.STATUS_ENUM.done.id).length
          const failCount = item.event_process.filter(p => p.status === ProgramEventBroadcasterEventProcess.STATUS_ENUM.fail.id).length
          Vue.set(item, 'totalCount', item.event_process.length)
          Vue.set(item, 'successCount', successCount)
          Vue.set(item, 'failCount', failCount)
          Vue.set(item, 'result', `${totalCount} действий: ${successCount} - успешно, ${failCount} - с ошибками `)
          return item
        })
      },

      filtered_list () {
        if (this.search_comp) {
          return this.eventListMaped.filter((item) => true)
        } else {
          return this.eventListMaped
        }
      },
      search_comp () {
        return this.search ? this.search.trim().toLowerCase() : ''
      },
    },
    watch: {

    },
    created () {
      this.loadData()
    },
    methods: {
      ...mapActions({
        GetBroadcasterLog: 'company/event_broadcasters/GetBroadcasterLog',
      }),
      async loadData () {
        if (!this.broadcasterId) return
        try {
          this.GetBroadcasterLogAction = true
          this.eventList = await this.GetBroadcasterLog(this.broadcasterId)
        } catch (e) {
          console.error(e)
        } finally {
          this.GetBroadcasterLogAction = false
        }
      },

    },
  }
</script>

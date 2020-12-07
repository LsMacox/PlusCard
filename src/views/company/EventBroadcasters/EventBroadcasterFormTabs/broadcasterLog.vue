<template>
  <BaseDrawerDialog
    v-model="dialog"
    title="Срабатывания активности клиентов"
    width="800px"
  >
    <!-- <v-row>
      <v-col class="body-l-semibold">
        {{}}
      </v-col>
    </v-row> -->
    <v-skeleton-loader
      :loading="GetBroadcasterLogAction && false"
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
           <v-col cols="auto">
                <v-btn
                  color="primary"
                  @click="loadData"
                >
                  <v-icon left>$iconify_feather-refresh-ccw</v-icon> Обновить
                </v-btn>
              </v-col>
        </v-row>
        <v-row>
          <v-col>
            <base-table
              :headers="headersMain"
              :data="filtered_list"
              :is-custom-header="false"
              :total-count="filtered_list.length"
              :loading="GetBroadcasterLogAction"
              :item-class="() => 'clickable-row'"
              :word-operations="['событие', 'события', 'событий']"
              :pagination="{
                sortBy: 'created_at',
                descending: 'descending',
              }"
              
              :expanded.sync="expanded"
              :search="search_comp"
              show-expand
              @click:row="(item) => {
                const index = expanded.findIndex(x => x.id === item.id)
                if (index>=0) {
                  expanded.splice(index,1)
                } else {
                  expanded.push(item)
                }
              }"
            >
              <template v-slot:[`item.createdAtFormat`]="{ item }">
                <date-column :value="item.created_at" />
              </template>

              <template v-slot:[`item.AccountSearchField`]="{ item }">
                <account-column :value="item.account" />
              </template>
              <template v-slot:[`item.result`]="{ item }">
                <span v-if="false">{{ item.totalCount }}:</span> <span class="success--text">{{ item.successCount }}</span>/</span> <span class="error--text">{{ item.failCount }}</span>
              </template>
              <template v-slot:expanded-item="{ item }">
                <td
                  v-if="item.event_process.length>0"
                  :colspan="headersMain.length"
                >
                  <v-data-table
                    :headers="processHeaders"
                    :items="item.event_process"
                    hide-default-footer
                    :expanded.sync="item.expanded"
                    dense
                  >
                    <template v-slot:[`item.created_at`]="row">
                      <date-column :value="row.item.created_at" />
                    </template>
                    <template v-slot:[`item.handler`]="row">
                      {{ row.item.handler.actionText }}
                    </template>
                    <template v-slot:[`item.status`]="row">
                      <v-btn
                        icon
                        x-small
                        @click="statusClick(item, row.item)"
                      >
                        <v-icon>{{ STATUS_ENUM.find(row.item.status).icon }}</v-icon>
                      </v-btn>
                    </template>

                    <template v-slot:expanded-item="row">
                      <td
                        :colspan="processHeaders.length"
                        class="error--text"
                      >
                        {{ row.item.error }}
                      </td>
                    </template>
                  </v-data-table>
                </td>
                <td
                  v-else
                  :colspan="headersMain.length"
                >
                  Данные отсутствуют
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
  import ProgramEventBroadcasterHandler from '@/models/program/broadcasterHandler'
  import Account from '@/models/program/account'
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
    constants: {
      STATUS_ENUM: ProgramEventBroadcasterEventProcess.STATUS_ENUM,
    },

    data () {
      return {
        search: '',
        GetBroadcasterLogAction: false,
        eventList: [],
        expanded: [],
        headersMain: [
          { text: 'ID', align: 'start', value: 'id', width: '6em' },
          { text: 'Дата', value: 'createdAtFormat', width: '10em' },
          { text: 'Клиент', value: 'AccountSearchField' },
          { text: 'Обработка', value: 'result', width: '10em' },
        ],
        processHeaders: [
          { text: 'ID', align: 'start', value: 'id', width: '7em' },
          { text: 'Дата', value: 'created_at' },
          { text: 'Действие', value: 'handler' },
          { text: 'Статус', value: 'status' },
        ],
      }
    },
    computed: {
      eventListMaped () {
        return this.eventList.map(item => {
          Vue.set(item, 'createdAtFormat', this.$moment.utc(item.created_at).local().format(config.date.DATETIME_FORMAT))

          const successCount = item.event_process.filter(p => p.status === ProgramEventBroadcasterEventProcess.STATUS_ENUM.done.id).length
          const failCount = item.event_process.filter(p => p.status === ProgramEventBroadcasterEventProcess.STATUS_ENUM.fail.id).length
          Vue.set(item, 'totalCount', item.event_process.length)
          Vue.set(item, 'successCount', successCount)
          Vue.set(item, 'failCount', failCount)
          Vue.set(item, 'expanded', [])
          Vue.set(item, 'account', new Account(item.account))
          Vue.set(item, 'AccountSearchField', item.account.searchField)
          Vue.set(item, 'event_process', item.event_process.map(item => new ProgramEventBroadcasterEventProcess(item)))

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
      statusClick (item, processItem) {
        if (processItem.status !== this.STATUS_ENUM.fail.id) return
        const index = item.expanded.findIndex(x => x.id === item.id)
        if (index >= 0) {
          item.expanded.splice(processItem, 1)
        } else {
          item.expanded.push(processItem)
        }
      },
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

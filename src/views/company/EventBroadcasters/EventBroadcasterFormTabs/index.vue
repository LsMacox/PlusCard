<template lang="">
  <v-row no-gutters>
    <v-col>
      <base-top-menu
        v-model="currentPage"
        :menu="pageList"
        :loading="saveAction"
        :show-action="!GetBroadcasterAction && hasChanges"
        cancelButtonText="Закрыть"
        @cancelbutton="cancelEdit()"
        @actionbutton="globalSave()"
      >
        <v-row
          justify="center"
          class="edit-form-row"
          no-gutters
        >
          <v-col
            :cols="10"
            :sm="10"
            :md="8"
          >
            <v-skeleton-loader
              :loading="GetBroadcasterAction"
              :style="{height: '100%', width: '100%'}"
              type="image@3, actions"
            >
              <v-row no-gutters><v-col>

                <v-tabs-items
                  v-if="broadcaster"
                  v-model="currentPage"
                >
                  <v-tab-item
                    :value="0"
                    eager
                  >
                    <tabMain
                      ref="tabMain"
                      v-model="broadcaster"
                      action-text="Сохранить"
                      action-icon=""
                      :action-loading="saveAction"
                      :action-show="hasChanges"
                      @continue="globalSave"
                    />
                  </v-tab-item>
                  <v-tab-item
                    :value="1"
                    eager
                  >
                    <tabFilter
                      ref="tabFilter"
                      v-model="broadcaster"
                      action-text="Сохранить"
                      action-icon=""
                      :action-loading="saveAction"
                      :action-show="hasChanges"
                      @continue="globalSave"
                    />
                  </v-tab-item>
                  <v-tab-item
                    :value="2"
                    eager
                  >
                    <tabHandlers
                      ref="tabHandlers"
                      v-model="broadcaster"
                    />
                  </v-tab-item>
                </v-tabs-items>
                </v-col>
              </v-row>
            </v-skeleton-loader>
          </v-col>
        </v-row>
      </base-top-menu>
    </v-col>
  </v-row>
</template>

<script>
  import Vue from 'vue'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: {
      tabFilter: () => import('./tabFilter'),
      tabHandlers: () => import('./tabHandlers'),
      tabMain: () => import('./tabMain'),
    },
    props: {
      broadcasterId: {
        type: Number,
        required: true,
      },
      startPage: {
        type: String,
        default: '#main',
      },
    },
    constants: {
    },
    data () {
      return {
        saveAction: false,
        currentPage: 0,
        GetBroadcasterAction: false,
        UpdateBroadcasterAction: false,
        originalBroadcaster: null,
        broadcaster: null,
        pageList: [
          { id: '#main', name: 'Общие настройки', route: { hash: '#main' } },
          { id: '#filter', name: 'Отбор клиентов', route: { hash: '#filter' } },
          { id: '#handlers', name: 'Обработчики', route: { hash: '#handlers' } },
        ],
      }
    },
    computed: {
      ...mapGetters('company/program', ['program']),
      hasChanges () {
        return JSON.stringify(this.getEditedObject(this.broadcaster)) !==
          JSON.stringify(this.getEditedObject(this.originalBroadcaster))
      },
      saveData () {
        return Object.assign({}, this.broadcaster, { broadcaster_id: this.broadcaster.id })
      },
    },
    created () {
      // this.pageList = pageList
      this.setItemById(this.startPage)
      console.log('this.currentPage', this.currentPage)
      this.init()
    },
    methods: {

      ...mapActions({
        GetBroadcaster: 'company/event_broadcasters/GetBroadcaster',
        UpdateBroadcaster: 'company/event_broadcasters/UpdateBroadcaster',
      }),

      getEditedObject (model) {
        return model ? {
          id: model.id,
          name: model.name,
          description: model.description,
          start_at: this.$moment(model.start_at).format(),
          finish_at: this.$moment(model.finish_at),
          emit_mode: model.emit_mode,
          listen_event: model.listen_event,
          client_filter: model.client_filter,
          period: model.period,
          async_process: model.async_process,
          with_trashed: model.with_trashed,
        } : null
      },

      async cancelEdit () {
        try {
          if (this.hasChanges) {
            await this.$confirm(
              'Имеются не сохраненные изменения. Закрыть без сохранения?',
              'Редактирование активности',
              {
                confirmButtonText: 'Закрыть',
                cancelButtonText: 'Отмена',
                type: 'warning',
              })
          }
          this.$router.back()
        } catch (error) {

        }
      },

      setItemById (id) {
        const index = this.pageList.findIndex(x => x.id === id)
        this.currentPage = (index >= 0 ? index : 0)
      },

      async globalSave () {
        console.log('globalSave')
        try {
          this.saveAction = true
          // TODO run save
          if (!this.$refs.tabMain.validate()) {
            console.log('invalid PageMain')
            this.setItemById('#main')
            return
          }
          console.log('this.$refs.PageRules', this.$refs.PageRules)
          const tabFilterValid = await this.$refs.tabFilter.validate()
          if (!tabFilterValid) {
            console.log('invalid PageRules')
            this.setItemById('#filter')
            return
          }

          console.log('valid ')
          const result = await this.UpdateBroadcaster(this.saveData)
          // await this.$sleep(1000)
          console.log('result update', result)

          this.$router.back()
        } catch (error) {
          console.error(error)
        } finally {
          this.saveAction = false
        }
      },

      async init () {
        try {
          this.GetBroadcasterAction = true
          this.originalBroadcaster = await this.GetBroadcaster(this.broadcasterId)

          this.broadcaster = Object.copy(this.originalBroadcaster)
        } finally {
          this.GetBroadcasterAction = false
        }
      },

    },
  }
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.cert-master-row {
  margin-top: $page-content-padding-size;
}
</style>

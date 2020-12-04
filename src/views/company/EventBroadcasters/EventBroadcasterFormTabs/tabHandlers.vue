<template>
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      <v-col>
        <BaseMasterFieldBlock
          title="Обработчики"
          description="Настройте обработчики, которые нужны для обработки этой активности клиента"
        >
          <template v-slot:input>
            <!-- {{ handlers }} -->
            <v-row v-if="model.handlers && model.handlers.length">
              <v-col>
                <base-table
                  class-name="table-handlers"
                  :headers="headers"
                  :data="handlers"
                  :is-custom-header="false"
                  :total-count="model.handlers.length"
                  :word-operations="['активность', 'активности', 'активностей']"
                  :pagination="{
                    sortBy: 'id',
                    descending: 'descending',
                  }"
                  disable-pagination

                  hide-default-footer
                  :search="search_comp"
                >
                  <template v-slot:[`item.active`]="{ item }">
                    <v-switch
                      v-model="item.active"
                      :loading="item.changeActiveAction"
                      :disabled="item.changeActiveAction"
                      inset
                      hide-details
                      class="custom-switch"
                      @change="activeChange(item, $event)"
                    />
                  </template>
                  <template v-slot:[`item.action_name`]="{ item }">
                    <v-switch
                      v-model="item.active"
                      :loading="item.changeActiveAction"
                      :disabled="item.changeActiveAction"
                      inset
                      hide-details
                      class="custom-switch"
                      @change="activeChange(item, $event)"
                    />
                  </template>

                  <template v-slot:[`item.actions`]="{ item }">
                    <v-icon @click="openHandlerFormClick(item)">
                      mdi-chevron-right
                    </v-icon>
                  </template>
                <!-- </v-data-table> -->
                </base-table>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-btn
                  color="secondary"
                  @click="createHandlerClick"
                >
                  <v-icon left>
                    $iconify_plus-circle-outlined
                  </v-icon>
                  Добавить обработчик
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </BaseMasterFieldBlock>
        <v-row>
          <v-col />
        </v-row>

        <v-row>
          <v-col>
            <v-btn
              v-if="!model.id"
              :disabled="!valid"
              color="primary"
              :loading="CreateBroadcasterAction"
              @click="onSaveClick"
            >
              <v-icon left>
                $iconify_plus-circle-outlined
              </v-icon>
              <span>Создать активность</span>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <eventHandlerDialog
      v-if="showHandlerDialog"
      v-model="showHandlerDialog"
      :model="editedHandler"
      @save="onSaveHandler"
      @delete="onDeleteHandler"
    />
  </v-container>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Vue from 'vue'
  import ProgramEventBroadcasterHandler from '@/models/program/broadcasterHandler'

  export default {
    components: {
      eventHandlerDialog: () => import('../components/eventHandlerDialog.vue'),
    },
    model: {
      prop: 'model',
      event: 'change',
    },
    props: {
      model: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        search: '',
        headers: [
          { text: 'ID', align: 'start', value: 'idText', width: '7em' },
          { text: 'Действие', value: 'actionText' },
          { text: '', value: '', filterable: false, sortable: false },
          { text: '', value: 'active', width: 1, filterable: false, sortable: false },
          { text: '', value: 'actions', width: 1, filterable: false, sortable: false },

        ],
        editedHandler: null,
        showHandlerDialog: false,
        CreateBroadcasterAction: false,

      }
    },
    computed: {
      search_comp () { return this.search ? this.search.trim().toLowerCase() : '' },
      valid () { return this.model.handlers && this.model.handlers.length },
      handlers () {
        return this.model.handlers.map((item) => {
          return new ProgramEventBroadcasterHandler(item)
        })
      },
    },
    created () {

    },
    methods: {
      ...mapActions({
        CreateBroadcasterHandler: 'company/event_broadcasters/CreateBroadcasterHandler',
        CreateBroadcaster: 'company/event_broadcasters/CreateBroadcaster',
        SetActiveBroadcasterHandler: 'company/event_broadcasters/SetActiveBroadcasterHandler',
      }),

      onNextClick () {
        if (this.$refs.form.validate()) {
          this.$emit('continue', true)
        }
      },

      openHandlerFormClick (item) {
        this.editedHandler = Object.copy(item)
        this.showHandlerDialog = true
      },
      async activeChange (item, active) {
        try {
          console.log('activeChange', item, active)
          item.changeActiveAction = true
          if (!item.isNew) {
            await this.SetActiveBroadcasterHandler({ handlerId: item.id, active })
          } else {
            item.active = active
          }
        } catch (error) {
          item.active = !item.active
        } finally {
          item.changeActiveAction = false
        }
      },
      createHandlerClick () {
        this.editedHandler = {
          // id:  this.$uuid()
          isNew: true,
          broadcaster_id: this.model.id,
          program_id: this.model.program_id,
          action_type: null,
          action_json: {},
          active: true,
        }

        this.showHandlerDialog = true
      },
      ADD_HANDLER (newHandler) {
        const indexHandler = this.model.handlers.findIndex((x) => x.id === newHandler.id)
        if (indexHandler >= 0) {
          const handler = this.model.handlers[indexHandler]
          Vue.set(this.model.handlers, indexHandler, Object.assign({}, handler, newHandler))
        } else {
          this.model.handlers.push(newHandler)
        }
      },

      REMOVE_HANDLER (handler) {
        const indexHandler = this.model.handlers.findIndex((x) => x.id === handler.id)
        if (indexHandler >= 0) this.model.handlers.splice(indexHandler, 1)
      },

      async onSaveClick () {
        try {
          this.CreateBroadcasterAction = true
          const broadcaster = await this.CreateBroadcaster(this.model)

          this.$emit('continue', true)
          this.model.handlers.forEach(item => {
            const data = Object.assign({}, item, { name: item.id, broadcaster_id: broadcaster.id })
            this.CreateBroadcasterHandler(data)
          })
        } catch (e) {
          console.log(e)
        } finally {
          this.CreateBroadcasterAction = false
        }
      },
      onSaveHandler (handler) {
        console.log('onSaveHandler', handler)
        handler.id = handler.id || this.$uuid()
        this.ADD_HANDLER(handler)
      },
      onDeleteHandler (handler) {
        this.REMOVE_HANDLER(handler)
      },
    },
  }
</script>
<style lang="scss" scoped>

@import '@/views/dashboard/form_component/_form-component.scss';
</style>

<template>
  <v-skeleton-loader
    :loading="GetListAction"
    :style="{ height: '100%', width: '100%' }"
    type="card-heading, image@3"
  >
    <v-container
      v-if="broadcasters.length > 0"
      fluid
      class=""
    >
      <v-row
        justify="space-between"
        align="center"
      >
        <v-col
          cols="auto"
          class="title-m-bold neutral-900--text"
        >
          Активности клиентов
        </v-col>
        <!-- <v-spacer /> -->
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
            <v-col cols="auto">
              <v-btn
                color="primary"
                @click="createBroadcasterClick"
              >
                <v-icon left>
                  $iconify_plus-circle-outlined
                </v-icon> <span>Создать</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-table
            class-name="table-moderations"
            :headers="headers"
            :data="filtered_broadcasters"
            :item-class="() => 'no-clickable-row'"
            :is-custom-header="false"
            :total-count="filtered_broadcasters.length"
            :word-operations="['активность', 'активности', 'активностей']"
            :pagination="{
              sortBy: 'updated_at',
              descending: 'descending',
            }"
            :search="search_comp"
            @click:row="openBroadcasterClick"
          >
            <!-- <v-data-table
            :headers="headers"
            :items="filtered_moderations"
          > -->
            <template v-slot:[`item.startAtFormat`]="{ item }">
              <date-column :value="item.start_at" />
            </template>
            <template v-slot:[`item.finishAtFormat`]="{ item }">
              <date-column :value="item.finish_at" />
            </template>
            <template v-slot:[`item.lastEmitFormat`]="{ item }">
              <date-column :value="item.last_emit" />
            </template>
            <template v-slot:[`item.nextEmitFormat`]="{ item }">
              <date-column :value="item.next_emit" />
            </template>
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

            <template v-slot:[`item.actions`]="{ item }">
              <v-menu
                offset-y
              >
                <template v-slot:activator="{ on }">
                  <v-btn
                    icon
                    small
                    :loading="item.loading"
                    v-on="on"
                  >
                    <v-icon>$iconify_feather-more-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item
                    v-for="(menuItem, index) in getItemActions(item)"
                    :key="index"
                    @click="menuItem.action(item)"
                  >
                    <v-list-item-icon>
                      <v-icon color="neutral-500">
                        {{ menuItem.icon }}
                      </v-icon>
                    </v-list-item-icon>
                    <v-list-item-title
                      :class=" {
                        'body-s-medium' : true,
                        'neutral-500--text':true,
                      }"
                    >
                      {{ menuItem.title }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <!-- </v-data-table> -->
          </base-table>
        </v-col>
      </v-row>
    </v-container>
    <!-- Заглушка -->
    <base-empty-block-page
      v-else
      title="Здесь пока ничего нет :’("
      description="TODO"
      action-icon="$iconify_ant-design-gift-outlined"
      action-text="Создать активность"
      action
      @action="createBroadcasterClick"
    >
      <template v-slot:image>
        <v-img
          src="@/assets/png/settings-dummy.png"
          width="193.96px"
          height="174px"
        />
      </template>
    </base-empty-block-page>
  </v-skeleton-loader>
</template>
<script>
  import { mapGetters, mapActions } from 'vuex'
  import Permission from '@/mixins/permission'
  import ProgramEventBroadcaster from '@/models/program/broadcaster'
  //   import Vue from 'vue'
  export default {
    components: {
      DateColumn: () => import('@/components/colums/DateColumn.vue'),
    },
    mixins: [Permission],
    data () {
      return {
        search: '',
        GetListAction: false,
        headers: [
          { text: 'ID', align: 'start', value: 'id', width: '7em' },
          { text: 'Название', value: 'name' },
          { text: 'Режим', value: 'emitModeText' },
          { text: 'Старт', value: 'startAtFormat', width: '9em' },
          { text: 'Окончание', value: 'finishAtFormat', width: '11em' },
          { text: 'Послед. запуск', value: 'lastEmitFormat', width: '9em' },
          { text: 'След. запуск', value: 'nextEmitFormat', width: '9em' },
          { text: '', value: 'active', width: '1em', filterable: false, sortable: false },
          { text: '', value: 'actions', width: '1em', filterable: false, sortable: false },

        ],
      }
    },
    computed: {
      ...mapGetters({
        programId: 'programId',
        broadcasters: 'company/event_broadcasters/broadcasters',
      }),
      filtered_broadcasters () {
        if (this.search_comp) {
          return this.broadcasters.filter((item) => true)
        } else {
          return this.broadcasters
        }
      },
      search_comp () {
        return this.search ? this.search.trim().toLowerCase() : ''
      },
    },
    watch: {
      programId (v) {
        this.loadData()
      },
    },
    created () {
      this.loadData()
    },
    methods: {
      ...mapActions({
        GetList: 'company/event_broadcasters/GetList',
        SetActiveBroadcaster: 'company/event_broadcasters/SetActiveBroadcaster',
        DeleteBroadcaster: 'company/event_broadcasters/DeleteBroadcaster',
      }),
      loadData () {
        console.log('loadData this.programId', this.programId)
        if (!this.programId) return
        this.GetListAction = true
        this.GetList(this.programId).finally(() => {
          this.GetListAction = false
        })
      },
      openBroadcasterClick (item = null) {
        // item.emit_mode = 'MANUAL'
      },
      createBroadcasterClick () {
        this.$router.push({ name: 'EventBroadcasterMaster' })
      },
      async activeChange (item, active) {
        try {
          console.log('activeChange', item, active)
          item.changeActiveAction = true
          // await this.$sleep()
          await this.SetActiveBroadcaster({
            id: item.id,
            active: active,
          })
        } catch (error) {
          item.active = !item.active
        } finally {
          item.changeActiveAction = false
        }
      },
      async deleteBroadcasterClick (item) {
        try {
          item.action = true
          // await this.$sleep()
          await this.DeleteBroadcaster(item.id)
        } catch (e) {
          console.error(e)
        } finally {
          item.action = false
        }
      },
      getItemActions (item) {
        return [
          {
            icon: '$iconify_feather-play',
            title: 'Запустить',
            action: (item) => {},
            show: item.active && item.emit_mode === ProgramEventBroadcaster.EMIT_MODE_ENUM.MANUAL.id && this.hasProgramPermission('program-broadcaster-run', item.program_id),
          },
          {
            icon: '$iconify_feather-edit',
            title: 'Редактировать',
            action: (item) => {
              this.$router.push({
                name: 'EventBroadcasterForm',
                params: {
                  id: item.id,
                },
              })
            },
            show: this.hasProgramPermission('program-broadcaster-update', item.program_id),
          },
          {
            icon: '$iconify_feather-trash',
            title: 'Удалить',
            action: this.deleteBroadcasterClick,
            show: !item.deleted_at && this.hasProgramPermission('program-broadcaster-delete', item.program_id),
          },
        ].filter(x => x.show)
      },
    },
  }
</script>

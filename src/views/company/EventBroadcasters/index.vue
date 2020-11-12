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
          Вещатели событий(Акции)
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
            class-name="table-moderations"
            :headers="headers"
            :data="filtered_broadcasters"
            :item-class="() => 'clickable-row'"
            :is-custom-header="false"
            :total-count="filtered_broadcasters.length"
            :word-operations="['модерация', 'модерации', 'модераций']"
            :pagination="{
              sortBy: 'updated_at',
              descending: 'descending',
            }"
            @click:row="openBroadcasterClick"
          >
            <!-- <v-data-table
            :headers="headers"
            :items="filtered_moderations"
          > -->
            <template v-slot:[`item.start_at`]="{ item }">
              <date-column :value="item.start_at" />
            </template>
            <template v-slot:[`item.finish_at`]="{ item }">
              <date-column :value="item.finish_at" />
            </template>

            <template v-slot:[`item.actions`]="{ item }">
              <v-icon @click="openModerationClick(item)">
                mdi-chevron-right
              </v-icon>
            </template>
            <!-- </v-data-table> -->
          </base-table>
        </v-col>
      </v-row>
      <moderation-form
        v-if="showDialog"
        v-model="showDialog"
        :moderation-id="moderationId"
        :program-id="programId"
      />
    </v-container>
    <!-- Заглушка -->
    <base-empty-block-page
      v-else
      title="Здесь пока ничего нет :’("
      description="TODO"
      action-icon="$iconify_ant-design-gift-outlined"
      action-text="Создать акцию"
      action
      @action="openBroadcasterClick"
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
//   import Vue from 'vue'
  export default {
    components: {
      DateColumn: () => import('@/components/colums/DateColumn.vue'),
    },
    data () {
      return {
        search: '',
        GetListAction: false,
        headers: [
          {
            text: 'ID',
            align: 'start',
            value: 'id',
            width: '7em',
          },
          { text: 'Название', value: 'name' },
          { text: 'Старт', value: 'start_at', width: '9em' },
          { text: 'Окончание', value: 'finish_at', width: '9em' },
          { text: 'Активна', value: 'active', width: '15em' },
          { text: '', value: 'actions', width: '1em' },
        ],
      }
    },
    computed: {
      ...mapGetters({
        programId: 'programId',
        broadcasters: 'company/event_broadcasters/broadcasters',
      }),
      filtered_broadcasters () {
        return this.broadcasters.filter((x) => true)
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
          
      },
    },
  }
</script>

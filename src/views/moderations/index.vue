<template>
  <v-skeleton-loader
    :loading="GetModerationListAction"
    :style="{height: '100%', width: '100%'}"
    type="card-heading, image@3"
  >
    <v-container
      v-if="moderations.length>0"
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
          История модераций
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
                placeholder="Поиск измененных данных"
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
            :data="filtered_moderations"
            :item-class="() => 'clickable-row'"

            :total-count="filtered_moderations.length"
            :word-operations="['модерация', 'модерации', 'модераций']"
            :pagination="{
              sortBy: 'updated_at',
              descending: 'descending',
            }"
            @click:row="openModerationClick"
          >
            <!-- <v-data-table
            :headers="headers"
            :items="filtered_moderations"
          > -->
            <template v-slot:[`item.updated_at`]="{ item }">
              <date-column :value="item.updated_at" />
            </template>
            <template v-slot:[`item.fields`]="{ item }">
              <span> {{ getFieldNameList(item) }} </span>
            </template>
            <template v-slot:[`item.user`]="{ item }">
              <user-column :user="item.user" />
            </template>
            <template v-slot:[`item.status`]="{ item }">
              <moderation-status-label :status="item.status" />
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
      description="Вы ничего не отправляли на модерацию"
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
  import Vue from 'vue'
  import dateTimeFormat from '@/mixins/dateTimeFormat.js'
  import { MODERATION_STATUS_ENUM } from '@/models/enums'

  export default {
    components: {
      DateColumn: () => import('@/components/colums/DateColumn.vue'),
      UserColumn: () => import('@/components/colums/UserColumn.vue'),
      ModerationForm: () => import('./ModerationForm.vue'),
      ModerationStatusLabel: () => import('./ModerationStatusLabel.vue'),
      // BaseTable: () => import('@/components/base/BaseTable'),
    },
    mixins: [dateTimeFormat],
    constants: {
      MODERATION_STATUS_ENUM: MODERATION_STATUS_ENUM,
    },
    data () {
      return {
        search: '',
        GetModerationListAction: false,
        headers: [
          {
            text: 'ID',
            align: 'start',
            value: 'id',
            width: '7em',
          },
          { text: 'Что редактировалось', value: 'EntityName' },
          { text: 'Какие поля', value: 'fields' },
          { text: 'Оператор', value: 'user' },
          { text: 'Дата', value: 'updated_at', width: '9em' },
          { text: 'Статус', value: 'status', width: '15em' },
          { text: '', value: 'actions', width: '1em' },
        ],
        moderationId: null,
        showDialog: false,

      }
    },

    computed: {
      ...mapGetters({
        programId: 'programId',
        moderations: 'company/moderations/moderationsMaped',
      }),
      moderationsMaped () {
        return this.moderations.map(x => {
          Vue.set(x, 'updated_at_format', this.$moment.utc(x.updated_at).local().format(this.$config.date.DATETIME_FORMAT))
          Vue.set(x, 'status_text', MODERATION_STATUS_ENUM.find(x.status).name)

          return x
        })
      },
      filtered_moderations () {
        if (this.search_comp) {
          return this.moderationsMaped.filter((item) =>
            item.id === +this.search_comp ||
            (item.EntityName && item.EntityName.toLowerCase().includes(this.search_comp)) ||
            (this.getFieldNameList(item).toLowerCase().includes(this.search_comp)) ||
            (item.user && item.user.UserName && item.user.UserName.toLowerCase().includes(this.search_comp)) ||
            (item.updated_at_format.toLowerCase().includes(this.search_comp)) ||
            (item.status_text.toLowerCase().includes(this.search_comp)),

          )
        } else {
          return this.moderationsMaped
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
    mounted () {

    },
    methods: {
      ...mapActions({
        GetModerationList: 'company/moderations/GetModerationList',
      }),
      getFieldNameList (item) {
        if (item.field_name_list) {
          return item.field_name_list.join(', ')
        } else {
          const uniqueArray = [...new Set(item.fields.map(f => f.field_name))]
          return uniqueArray.join(', ')
        }
      },
      loadData () {
        console.log('loadData this.programId', this.programId)
        if (!this.programId) return
        this.GetModerationListAction = true
        this.GetModerationList(this.programId)
          .finally(() => {
            this.GetModerationListAction = false
          })
      },
      openModerationClick (item) {
        console.log('openModerationClick', item)
        this.moderationId = item.id
        this.showDialog = true
      },

    },
  }
</script>

<style lang="scss" scoped>
.moderation-row{
  cursor: pointer;
}
</style>

<template>
  <v-skeleton-loader
    :loading="GetMerchantOperationListAction"
    :style="{height: '100%', width: '100%'}"
    type="card-heading, image@3"
  >
    <v-container
      v-if="operations.length>0 && true"
      fluid
      class=""
    >
      <v-row
        justify="space-between"
        align="center"
      >
        <v-col>
          <v-row>
            <v-col>
              <base-text-field
                v-model.trim="search"
                :prepend-inner-icon="'$iconify_search-outlined'"
                placeholder="Поиск и фильтр"
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
            class-name="table-balance-operations"
            :headers="headers"
            :data="filtered_operations"
            :is-custom-header="false"
            :total-count="filtered_operations.length"
            :word-operations="['операция', 'операции', 'операций']"
            :pagination="{
              sortBy: 'created_at',
              descending: 'descending',
            }"
            :options="{
              itemsPerPage: 5
            }"
            @click:row="onClickRow"
          >
            <!-- <v-data-table
            :headers="headers"
            :items="filtered_moderations"
          > -->
            <template v-slot:[`item.created_at`]="{ item }">
              <date-column :value="item.created_at" />
            </template>
            <template v-slot:[`item.user`]="{ item }">
              <user-column
                v-if="item.user"
                :user="item.user"
              />
              <user-column
                v-else
                :user="{
                  avatar: require('@/assets/svg/logo_32x32.svg'),
                  UserName: 'Система'
                }"
                :show-last-activity="false"
              />
            </template>
            <template v-slot:[`item.operation_type`]="{ item }">
              <operation-type-row :operation-type="item.operation_type" />
            </template>
            <template v-slot:[`item.value_rub`]="{ item }">
              <span :class="['body-s-semibold',BALANCE_OPERATION_TYPE_ENUM.find(item.operation_type).color + '--text']">{{ (item.operation_type == BALANCE_OPERATION_TYPE_ENUM.debit.id? '-':'+') + item.value_rub }} ₽</span>
            </template>

          <!-- </v-data-table> -->
          </base-table>
        </v-col>
      </v-row>
    </v-container>
    <!-- Заглушка -->
    <base-empty-block-page
      v-else
      title="Операций еще не было"
      description="Здесь будут отображаться все операции по вашему внутреннему балансу."
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
  import { BALANCE_OPERATION_TYPE_ENUM } from '@/models/enums'

  export default {
    name: 'Operations',
    components: {
      DateColumn: () => import('@/components/colums/DateColumn.vue'),
      UserColumn: () => import('@/components/colums/UserColumn.vue'),
      OperationTypeRow: () => import('./OperationTypeRow.vue'),
    },
    mixins: [dateTimeFormat],
    constants: {
      BALANCE_OPERATION_TYPE_ENUM: BALANCE_OPERATION_TYPE_ENUM,
    },
    data () {
      return {
        search: '',
        GetMerchantOperationListAction: false,
        headers: [
          {
            text: 'ID',
            align: 'start',
            value: 'id',
            width: '7em',
          },
          { text: 'Дата', value: 'created_at',  width: '6em',},
          { text: 'Тип опреации', value: 'operation_type' },
          { text: 'Сумма', value: 'value_rub' },
          { text: 'Оператор', value: 'user' },
          { text: 'Описание', value: 'description' },
        ],

      }
    },
    computed: {
      ...mapGetters({
        programId: 'programId',
        operations: 'auth/merchant/balanceOperations',
      }),
      operationsMaped () {
        return this.operations.map(x => {
          Vue.set(x, 'created_at_format', this.$moment.utc(x.created_at).local().format(this.$config.date.DATETIME_FORMAT))
          Vue.set(x, 'operation_type_text', BALANCE_OPERATION_TYPE_ENUM.find(x.operation_type).text)
          return x
        })
      },
      filtered_operations () {
        if (this.search_comp) {
          return this.operationsMaped.filter((item) =>
            item.id === +this.search_comp ||
            (item.user && item.user.UserName && item.user.UserName.toLowerCase().includes(this.search_comp)) ||
            (item.created_at_format.toLowerCase().includes(this.search_comp)) ||
            (item.value_rub.toLowerCase().replace(' ', '').includes(this.search_comp)) ||
            (item.description.toLowerCase().includes(this.search_comp)) ||
            (item.operation_type_text.toLowerCase().includes(this.search_comp)),
          )
        } else {
          return this.operationsMaped
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
        GetMerchantOperationList: 'auth/merchant/GetBalanceOperations',
      }),
      loadData () {
        console.log('loadData')
        this.GetMerchantOperationListAction = true
        this.GetMerchantOperationList()
          .finally(() => {
            this.GetMerchantOperationListAction = false
          })
      },
      onClickRow () {},
    },
  }
</script>

<style scoped>
  .operation {
    max-width: 1024px;
    width: 100%;
    margin: 0 auto;
  }
  .select-item {
    width: 138px;
  }
  .no-data {
    height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    max-width: 500px;
    width: 100%;
    margin: 0 auto;
  }
  .text-info-no-data {
    text-align: center;
  }
  .text-info-no-data .font-size-20 {
    margin-bottom: 12px;
  }
  .img-no-data {
    margin-bottom: 34px;
  }
  .pagination-block {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .wrap-select {
    display: flex;
    align-items: center;
  }
  .wrap-select p {
    margin-right: 20px;
  }
</style>

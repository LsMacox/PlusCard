<template>
  <v-skeleton-loader
    :loading="GetOrdersActions"
    :style="{height: '100%', width: '100%'}"
    type="card-heading, image@3"
  >
    <v-container
      v-if="orders.length>0"
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
            <v-col cols="auto">
              <v-btn
                color="primary"
                @click="onCreateOrderClick"
              >
                <v-icon left>
                  $iconify_plus-circle-outlined
                </v-icon> Создать счет на оплату
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <base-table
            class-name="table-balance-operations"
            :headers="headers"
            :data="filtered_orders"
            :is-custom-header="false"
            :total-count="filtered_orders.length"
            :word-operations="['счет', 'счета', 'счетов']"
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
            <template v-slot:[`item.status`]="{ item }">
              <status-column
                :icon="item.status_enum.icon"
                :text="item.status_enum.text"
                :color="item.status_enum.color"
              />
            </template>
            <template v-slot:[`item.value_rub`]="{ item }">
              <span class="body-s-semibold">{{ item.value_rub }} ₽</span>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                icon
                color="primary"
                :loading="item.GetOrderPdfAction"
                :disabled="item.GetOrderPdfAction"
                x-small
                @click="downloadOrderClick(item)"
              >
                <v-icon>$iconify_feather-download</v-icon>
              </v-btn>
            </template>

          <!-- </v-data-table> -->
          </base-table>
        </v-col>
      </v-row>
    </v-container>
    <!-- Заглушка -->
    <base-empty-block-page
      v-else
      title="Счета отсутсвуют"
      description="Здесь будут отображаться все выставленные нами счета."
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
  import { MERCHANT_ORDER_STATUS_ENUM } from '@/models/enums'

  export default {
    name: 'Operations',
    components: {
      DateColumn: () => import('@/components/colums/DateColumn.vue'),
      StatusColumn: () => import('@/components/colums/StatusColumn.vue'),
    },
    mixins: [dateTimeFormat],
    constants: {
      MERCHANT_ORDER_STATUS_ENUM: MERCHANT_ORDER_STATUS_ENUM,
    },
    data () {
      return {
        search: '',
        GetOrdersActions: false,
        headers: [
          { text: 'ID', align: 'start', value: 'id', width: '7em' },
          { text: 'Дата', value: 'created_at', width: '6em' },
          { text: 'Статус', value: 'status' },
          { text: 'Сумма', value: 'value_rub' },
          { text: 'Описание', value: 'description' },
          { text: '', value: 'actions', width: '1em' },
        ],
      }
    },
    computed: {
      ...mapGetters({
        programId: 'programId',
        orders: 'auth/merchant/orders',
      }),

      ordersMaped () {
        return this.orders.map(x => {
          Vue.set(x, 'created_at_format', this.$moment.utc(x.created_at).local().format(this.$config.date.DATETIME_FORMAT))
          Vue.set(x, 'status_text', MERCHANT_ORDER_STATUS_ENUM.find(x.status).text)
          Vue.set(x, 'status_enum', MERCHANT_ORDER_STATUS_ENUM.find(x.status))
          Vue.set(x, 'GetOrderPdfAction', false)
          return x
        })
      },

      filtered_orders () {
        if (this.search_comp) {
          return this.ordersMaped.filter((item) =>
            item.id === +this.search_comp ||
            (item.created_at_format.toLowerCase().includes(this.search_comp)) ||
            (item.value_rub.toLowerCase().replace(' ', '').includes(this.search_comp)) ||
            (item.description.toLowerCase().includes(this.search_comp)) ||
            (item.status_text.toLowerCase().includes(this.search_comp)),
          )
        } else {
          return this.ordersMaped
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
        GetOrders: 'auth/merchant/GetOrders',
        GetOrderPdf: 'auth/merchant/GetOrderPdf',
      }),
      loadData () {
        this.GetOrdersActions = true
        this.GetOrders()
          .finally(() => {
            this.GetOrdersActions = false
          })
      },
      onClickRow () {},
      onCreateOrderClick () {},

      async downloadOrderClick (order) {
        try {
          order.GetOrderPdfAction = true
          await this.GetOrderPdf(order)
        } catch (e) {
          console.error(e)
        } finally {
          order.GetOrderPdfAction = false
        }
      },
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

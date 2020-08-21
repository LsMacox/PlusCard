<template>
  <v-container>
    <v-row>

      <v-col cols="12" style="width: 1024px">
        <v-data-table
            :headers="headers"
            :items="tableData"
            :single-expand="true"
            :expanded.sync="expanded"
            item-key="bsid"
            show-expand
            class="plus-table"
            hide-default-footer
        >
          <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
              More info about {{ item.bsid }}
            </td>
          </template>

          <template v-slot:item.data-table-expand="{ expand, isExpanded }">
            <span
                class="iconify"
                data-icon="bi:chevron-right"
                data-inline="false"
                @click="expand(!isExpanded)"
            />
          </template>

          <template v-slot:item.name="{ item }">
            <div class="td-padding-wrapper">
              <div class="td-content-main">
                {{ item.name }}
              </div>
              <div class="hint" style="color: #4776E6;">
                PLS-4161PLUS
              </div>
            </div>
          </template>

          <template v-slot:item.buyer="{ item }">
            <div class="avatar">
              <img src="https://storage.yandexcloud.net/plusstorage/users/avatars/1db311620af449cf9aa354491e5310d4.jpg">
            </div>
            <div class="td-content-wrapper">
              <div class="td-content-main">
                {{ item.buyer }}
              </div>
              <div class="hint" style="color: #9191A1">
                Был(а) в сети 02.08.2020 в 04:32
              </div>
            </div>
          </template>

          <template v-slot:item.price="{ item }">
            {{ item.price }}
          </template>

          <template v-slot:item.payment_status="{ item }">
            <img :src="require('@/icons/svg/' + item.payment_status + '.svg')">
          </template>

          <template v-slot:item.status="{ item }">
            <img :src="require('@/icons/svg/' + item.status + '.svg')">
          </template>

          <template v-slot:item.merchant_order_status="{ item }">
            <img :src="require('@/icons/svg/payments/' + item.merchant_order_status + '.svg')">
          </template>

          <template v-slot:item.issued="{ item }">
            <div class="td-content-wrapper">
              <div class="td-content-main">
                {{ item.issued }}
              </div>
              <div class="hint">
                21.10.2020
              </div>
            </div>
          </template>

          <template v-slot:item.used_at="{ item }">
            <div class="td-content-wrapper">
              <div class="td-content-main">
                {{ item.used_at }}
              </div>
              <div class="hint">
                21.10.2020
              </div>
            </div>
          </template>

        </v-data-table>
      </v-col>

    </v-row>

      <v-row align="center" class="pagination">
        <v-col class="pagination-total">
          <span>Всего {{ total }}</span>
        </v-col>

        <v-col cols="8">
          <div class="text-center">
            <v-pagination
                next-icon="fas fa-chevron-right"
                prev-icon="fas fa-chevron-left"
                v-model="page"
                :length="20"
                :total-visible="7"
                circle
            ></v-pagination>
          </div>
        </v-col>

        <v-col class="pagination-per-page">
          <v-select
              class="pagination-select"
              :items="paginationOptions"
              v-model="perPage"
              item-text="text"
              item-value="value"
              append-icon="fas fa-chevron-down"
              dense
          ></v-select>
        </v-col>

      </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Certificates',
    data () {
      return {
        page: 0,
        total: 150,
        perPage: 10,
        paginationOptions: [
          { text: '5 на странице', value: 5 },
          { text: '10 на странице', value: 10 },
          { text: '15 на странице', value: 15 },
          { text: 'Показать все', value: 0 },
        ],
        expanded: [],
        headers: [
          {
            text: 'Сертификат',
            align: 'start',
            value: 'name',
          },
          {
            text: 'Цена',
            value: 'price',
          },
          {
            text: 'Покупатель',
            value: 'buyer',
          },
          {
            text: 'Оплата',
            value: 'payment_status',
          },
          {
            text: 'Статус',
            value: 'status',
          },
          {
            text: 'Выплата',
            value: 'merchant_order_status',
          },
          {
            text: 'Выпущен',
            value: 'issued',
          },
          {
            text: 'Использован',
            value: 'used_at',
          },
          { text: '', value: 'data-table-expand' },
        ],
        tableData: [
          {
            name: 'Сертификат #1',
            price: 1000,
            buyer: 'Ivanov Ivan',
            payment_status: 'card',
            status: 'released',
            merchant_order_status: 'paid',
            issued: '21.04.2020',
            used_at: '23.07.2020',
          },
          {
            name: 'Сертификат #2',
            price: 1400,
            buyer: 'Ivanov Ivan',
            payment_status: 'waiting',
            status: 'placed',
            merchant_order_status: 'paid',
            issued: '21.04.2020',
            used_at: '23.07.2020',
          },
          {
            name: 'Сертификат #3',
            price: 6534,
            buyer: 'Ivanov Ivan',
            payment_status: 'cashier',
            status: 'deleted',
            merchant_order_status: 'dont-needed',
            issued: '21.04.2020',
            used_at: '23.07.2020',
          },
          {
            name: 'Сертификат #4',
            price: 3245,
            buyer: 'Ivanov Ivan',
            payment_status: 'another',
            status: 'paid',
            merchant_order_status: 'not-paid',
            issued: '21.04.2020',
            used_at: '23.07.2020',
          },
          {
            name: 'Сертификат #5',
            price: 4325,
            buyer: 'Ivanov Ivan',
            payment_status: 'another',
            status: 'waiting',
            merchant_order_status: 'waiting',
            issued: '21.04.2020',
            used_at: '23.07.2020',
          },
          {
            name: 'Сертификат #6',
            price: 1234,
            buyer: 'Ivanov Ivan',
            payment_status: 'another',
            status: 'used',
            merchant_order_status: 'dont-needed',
            issued: '21.04.2020',
            used_at: '23.07.2020',
          },
        ],
      }
    },
    methods: {
      paymentStatusIcon (status) {
        switch (status) {
          case 'waiting': return require('@/icons/svg/' + status + '.svg'); break;
          case 'cashier': return require('@/icons/svg/cashier.svg'); break;
          case 'card': return '@/icons/svg/card.svg'; break;
          default: return '@/icons/svg/another.svg'
        }
      },
    },
  }
</script>

<style scoped>

</style>

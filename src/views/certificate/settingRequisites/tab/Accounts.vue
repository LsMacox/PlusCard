<template>
  <div class="accounts">
    <div
      class="no-data"
    >
      <div class="img-no-data">
        <v-img
          src="@/assets/png/Icn.jpg"
          max-width="187"
        />
      </div>
      <div class="text-info-no-data">
        <h3 class="font-size-20">
          Счета отсутсвуют
        </h3>
        <p class="desc-15">
          Здесь будут отображаться все выставленные нами счета.
        </p>
      </div>
    </div>
    <div>
      <v-text-field
        placeholder="Поиск и фильтр"
        single-line
        solo
        hide-details
        prepend-inner-icon="mdi-magnify"
        class="custom-input"
      />
    </div>
    <div>
      <v-data-table
        :headers="headers"
        :items="desserts"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="elevation-0 custom-table accounts-table"
        @page-count="pageCount = $event"
      >
        <template v-slot:item.typeOperation="{ item }">
          <div class="text-type">
            <div
              class="round-item-type"
              :class="`bg-round-light-${checkStatus(item.typeOperation)}`"
            >
              <span
                class="round-item-type-inside"
                :class="`bg-round-${checkStatus(item.typeOperation)}`"
              />
            </div>
            <div :class="`color-text-${checkStatus(item.typeOperation)}`">
              {{ item.typeOperation.text }}
            </div>
          </div>
        </template>
        <template v-slot:item.date="{ item }">
          <div>
            <div class="desc-13-text font-weight-500 color-text-dark">
              {{ item.date.time }}
            </div>
            <div class="desc-11 font-weight-600 text-light-grey">
              {{ item.date.inTime }}
            </div>
          </div>
        </template>
        <template v-slot:item.price="{ item }">
          <div class="color-text-dark font-weight-600 desc-13-text">
            {{ item.price }} ₽
          </div>
        </template>
        <template v-slot:item.description="{ item }">
          <div class="dec-big-in-table">
            {{ item.description }}
          </div>
        </template>
        <template v-slot:item.operator="{ item }">
          <div class="img-operator">
            <div class="round-img-table">
              <v-img src="@/assets/png/22.png" />
              <!--              <img :src="require(`${item.operator.img}`)">-->
            </div>
            <div>
              <p class="desc-13 color-text-dark font-weight-500">
                {{ item.operator.name }}
              </p>
              <span class="desc-11 text-light-grey font-weight-600">{{ item.operator.time }}</span>
            </div>
          </div>
        </template>
        <template v-slot:item.download="{ item }">
          <div class="img-download">
            <v-img src="@/assets/png/download.png" />
            {{ item.download }}
            <!--              <img :src="require(`${item.operator.img}`)">-->
          </div>
        </template>
      </v-data-table>
      <div class="pagination-block">
        <!--        <v-text-field-->
        <!--          :value="itemsPerPage"-->
        <!--          label="Items per page"-->
        <!--          min="-1"-->
        <!--          max="15"-->
        <!--          @input="itemsPerPage = parseInt($event, 10)"-->
        <!--        ></v-text-field>-->
        <div class="wrap-select">
          <p class="font-weight-500 text-light-grey desc-13">
            1 239 операций на 124 страницах
          </p>
          <div class="select-item">
            <v-select
              v-model="selectItem"
              :items="items"
              item-text="title"
              item-value="value"
              persistent-hint
              return-object
              single-line
              class="custom-select"
            />
          </div>
        </div>
        <v-pagination
          v-model="page"
          class="custom-pagination"
          :length="pageCount"
        />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Accounts',
    data () {
      return {
        selectItem: {
          title: '10 на страницу',
          value: 10,
        },
        items: [
          {
            title: '10 на страницу',
            value: 10,
          },
          {
            title: '20 на страницу',
            value: 20,
          },
        ],
        headers: [
          {
            text: '№',
            align: 'start',
            value: 'id',
          },
          { text: 'Дата', value: 'date' },
          { text: 'Статус', value: 'typeOperation' },
          { text: 'Сумма', value: 'price' },
          { text: 'Описание', value: 'description' },
          { text: '', value: 'download', sortable: false, },
        ],
        desserts: [
          {
            id: 2,
            date: {
              time: '20.08.2020',
              inTime: 'в 14:02',
            },
            typeOperation: {
              text: 'Не оплачено',
              type: 'notPaid',
            },
            price: '990',
            description: 'Зачисление на лицевой счёт №23 по Договору №2020-1-7 длинной в 2 строки будет вот так выглядеть примерно.',
            download: '',
          },
          {
            id: 1,
            date: {
              time: '20.08.2020',
              inTime: 'в 14:02',
            },
            typeOperation: {
              text: 'Оплачено',
              type: 'paidUp',
            },
            price: '990',
            description: 'Зачисление на лицевой счёт №212 по Договору №2020-11-12',
            download: '',
          },
          {
            id: 5,
            date: {
              time: '20.08.2020',
              inTime: 'в 14:02',
            },
            typeOperation: {
              text: 'В ожидании',
              type: 'pending',
            },
            price: '990',
            description: 'Короткое описание ',
            download: '',
          },
          {
            id: 7,
            date: {
              time: '20.08.2020',
              inTime: 'в 14:02',
            },
            typeOperation: {
              text: 'Отменено',
              type: 'canceled',
            },
            price: '100',
            description: 'Зачисление на лицевой счёт №23 по Договору №2020-1-7',
            download: '',
          },
          {
            id: 20,
            date: {
              time: '20.08.2020',
              inTime: 'в 14:02',
            },
            typeOperation: {
              text: 'Не оплачено',
              type: 'notPaid',
            },
            price: '100',
            description: 'Зачисление на лицевой счёт №23 по Договору №2020-1-7',
            download: '',
          },
        ],
        page: 1,
        pageCount: 0,
        itemsPerPage: 10,
      }
    },
    methods: {
      checkStatus (item) {
        switch (item.type) {
          case 'notPaid':
            return 'red'
          case 'paidUp':
            return 'green'
          case 'pending':
            return 'yellow'
          case 'canceled':
            return 'grey'
        }
      },
    },
  }
</script>

<style scoped>
  .accounts {
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
  .img-download {
    width: 15px;
    cursor: pointer;
  }
</style>

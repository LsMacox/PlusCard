<template>
  <div class="documents">
    <div
      class="no-data"
    >
      <div class="img-no-data">
        <v-img
          src="@/assets/png/settings-dummy.png"
          max-width="187"
        />
      </div>
      <div class="text-info-no-data">
        <h3 class="font-size-20">
          Запросы докуметов отсутствуют
        </h3>
        <p class="desc-15">
          Здесь отображаются актуальные запросы по загрузке документов. На данный момент никаких запросов нет.
        </p>
      </div>
    </div>
    <div class="text-center ">
      <h2 class="title-h2 color-text-dark font-weight-bold">
        История запросов
      </h2>
    </div>
    <div>
      <v-data-table
        :headers="headers"
        :items="documents"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="elevation-0 custom-table documents-tables"
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
      </v-data-table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Documents',
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
            text: 'Тип',
            align: 'start',
            value: 'type',
          },
          { text: 'Документ №', value: 'document' },
          { text: 'Запрос', value: 'request' },
          { text: 'Подписание', value: 'signing' },
          { text: 'Статус', value: 'typeOperation' },
        ],
        documents: [
        ],
        page: 1,
        pageCount: 0,
        itemsPerPage: 10,
      }
    },
    computed: {
      merchant () {
        return this.$store.getters['auth/auth/merchant']
      },
      docs () {
        return this.$store.getters['settings/document/documents']
      },
    },
    watch: {
      docs (v) {
        v.forEach(item => {
          this.documents.push(
            {
              id: item.id,
              type: item.documents_type.type_title,
              document: item.number,
              request: this.$moment(item.created_at).format('DD.MM.YYYY'),
              signing: item.document_date ? this.$moment(item.document_date).format('DD.MM.YYYY') : 'Дата не указана',
              typeOperation: {
                text: 'На рассмотрении',
                type: 'pending',
              },
            },
          )
        })
      },
    },
    mounted () {
      this.$store.dispatch('settings/document/list', this.merchant.id)
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
  .documents {
    max-width: 1024px;
    width: 100%;
    margin: 0 auto;
  }
  .select-item {
    width: 138px;
  }
  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    max-width: 500px;
    width: 100%;
    margin: 0 auto 60px;
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

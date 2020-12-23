<template>
  <div>
    <div class="container-cash-info">
      <div class="title-cash">
        <h2 class="title-h2">
          {{ merchant.name }}
        </h2>
        <div class="block-cash-btn">
          <span class="cash color-green-text font-weight-bold title-h2">{{ balance + ' ₽' }}</span>
          <v-btn
            color="primary"
            @click="onAddBalanceClick"
          >
            <v-icon left>
              $iconify_feather-credit-card
            </v-icon>
            <span>Пополнить</span>
          </v-btn>
        </div>
      </div>
      <div class="info-block">
        <div class="info-wrap">
          <div class="desc-13-text font-weight-600">
            Статус
          </div>
          <div class="desc-15-text font-weight-500 color-green-text text-img">
            Активный
          </div>
        </div>
        <div class="info-wrap">
          <div class="desc-13-text font-weight-600">
            Соглашение
          </div>
          <div class="desc-15-text font-weight-500 color-text-grey text-img">
            Принято 5 окт, 2019  <img
              class="mlo-6"
              src="@/icons/svg/external-link.svg"
            >
          </div>
        </div>
        <div class="info-wrap">
          <div class="desc-13-text font-weight-600">
            Договор
          </div>
          <div class="desc-15-text font-weight-500 color-text-grey text-img">
            №2020-1-7 от 5 окт, 2019 <img
              class="mlo-6"
              src="@/icons/svg/download.svg"
            >
          </div>
        </div>
      </div>
    </div>
    <div
      v-for="(item, index) in tariffContent"
      :key="index"
      class="mbo-30"
    >
      <h2 class="title-h2 mbo-20">
        {{ item.title }}
      </h2>
      <div
        v-for="(content, indexContent) in item.content"
        :key="indexContent"
        class="block-info"
      >
        <div class="img-block-info">
          <img src="@/assets/svg/rocket.svg">
        </div>
        <div class="block-switch-tariff">
          <div class="block-switch-title">
            <h3 class="title-h3 font-weight-600">
              {{ content.titleNameTariff }}
            </h3>
            <div class="switch-block">
              <p class="desc-15 color-text-dark mr-1">
                Автопродление
              </p>
              <v-switch
                v-model="content.autoRenewal"
                inset
                class="custom-switch"
              />
            </div>
          </div>
          <div class="block-info-tariff">
            <div class="info-tariff mgo">
              <div>
                <p class="font-weight-600 desc-13">
                  Стоимость
                </p>
              </div>
              <div class="btn-text">
                <span class="cash-tariff desc-15-text color-text-grey font-weight-500">{{ content.price }} ₽ / мес</span>
                <v-btn
                  color="secondary"
                  :text="true"
                  :ripple="false"
                >
                  Изменить
                </v-btn>
              </div>
            </div>
            <div class="info-tariff">
              <div>
                <p class="font-weight-600 desc-13">
                  Следующий платеж
                </p>
              </div>
              <div class="btn-text">
                <span class="cash-tariff desc-15-text color-text-grey font-weight-500">{{ content.nextPayment }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <create-order-dialog
      v-if="createDialog"
      v-model="createDialog"
      @close="onCreateDialogClose"
    />
  </div>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    name: 'Balance',
    components: {
      CreateOrderDialog: () => import('../dialogs/CreateOrderDialog.vue'),
    },
    data () {
      return {
        createDialog: false,
        tariffContent: [
          {
            title: 'Тарифный план',
            content: [
              {
                titleNameTariff: 'Тариф START',
                price: '2990',
                nextPayment: '31 дек. 2021',
                autoRenewal: true,
              },
            ],
          },
          /*
          {
            title: 'Подключенные механики',
            content: [
              {
                titleNameTariff: 'Собственная механика 1',
                price: '650',
                nextPayment: '16 сен, 2020',
                autoRenewal: false,
              },
              {
                titleNameTariff: 'Собственная механика 2',
                price: '450',
                nextPayment: '34 сен, 2022',
                autoRenewal: true,
              },
            ],
          },
            */
        ],
      }
    },
    computed: {
      merchant () {
        return this.$store.getters.merchant
      },
      balance () {
        return this.merchant ? this.merchant.balance_rub : '0'
      },
    },
    methods: {
      ...mapActions({
        GetOrderPdf: 'auth/merchant/GetOrderPdf',
      }),
      onAddBalanceClick () {
        this.createDialog = true
      },
      onCreateDialogClose (newOrder) {
        if (newOrder) {
          this.downloadOrderClick(newOrder)
        }
        this.$router.push({ name: 'SettingsRequisites', hash: '#orders' })
      },
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
  .block-cash-btn {
    display: flex;
    align-items: center;
  }
  .cash {
    margin-right: 34px;
  }
  .title-cash {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 10px;
  }
  .custom-gradient-bg {
    display: flex;
    align-items: center;
  }
  .card-outline {
    margin-right: 8px;
  }
  .info-wrap {
    display: flex;
    justify-content: space-between;
  }
  .info-block {
    max-width: 320px;
    width: 100%;
  }
  .container-cash-info {
    margin-top: 68px;
    margin-bottom: 40px;
  }
  .info-wrap:not(:last-of-type) {
    margin-bottom: 12px;
  }
  .text-img {
    display: flex;
    align-items: center;
    min-width: 192px;
  }
  .mlo-6 {
    margin-left: 6px;
  }
  .mgo {
    margin-bottom: 12px;
  }
  .mbo-20 {
    margin-bottom: 20px;
  }
  .mbo-30 {
    margin-bottom: 30px;
  }
  .block-info {
    border: 1px solid #F2F2F7;
    box-sizing: border-box;
    box-shadow: 0px 24px 20px -16px rgba(88, 93, 106, 0.1);
    border-radius: 10px;
    background: #FFFFFF;
    width: 100%;
    max-width: 676px;
    padding: 20px 10px 20px 20px;
    display: flex;
  }
  .block-info:not(:last-of-type) {
    margin-bottom: 26px;
  }
  .img-block-info img {
    width: 47px;
    height: 47px;
  }
  .switch-block {
    display: flex;
    align-items: center;
  }
  .block-switch-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 22px;
    margin-bottom: 14px;
  }
  .block-switch-tariff {
    width: 100%;
    margin-left: 6px;
  }
  .info-tariff {
    display: flex;
    align-items: center;
    max-width: 300px;
    width: 100%;
    justify-content: space-between;
  }
  .btn-text {
    width: 164px;
    display: flex;
    align-items: center;
  }
</style>

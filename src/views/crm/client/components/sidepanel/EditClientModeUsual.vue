<template>
  <div>
    <div class="mode-usual__contacts-info">
      <ul class="contacts-info__list">
        <li class="contacts-info__item">
          <iconify-icon
            class="info__item-icon"
            icon="ion-phone-portrait-outline"
            width="21"
          />
          <p class="body-m-medium neutral-700--text">
            {{ (clientData.user && clientData.user.phone) ? clientData.user.phone : '-' }}
          </p>
        </li>
        <li class="contacts-info__item">
          <iconify-icon
            class="info__item-icon"
            icon="ion-mail-outline"
            width="21"
          />
          <p class="body-m-medium neutral-700--text">
            {{ (clientData.user && clientData.user.email) ? clientData.user.email : '-' }}
          </p>
        </li>
        <li class="contacts-info__item">
          <iconify-icon
            class="info__item-icon"
            icon="ion-barcode-outline"
            width="21"
          />
          <p class="body-m-medium neutral-700--text">
            {{ clientData.barcode || '-' }}
          </p>
        </li>
        <li class="contacts-info__item">
          <iconify-icon
            class="info__item-icon"
            icon="feather-credit-card"
            width="21"
          />
          <p class="body-m-medium neutral-700--text">
            {{ clientData.id || '-' }}
          </p>
        </li>
      </ul>
    </div>
    <div>
      <bonus-account
        :client-data="clientData"
      />
    </div>
    <div class="mode-usual__panel-btn">
      <v-btn
        class="panel-btn"
        @click="clickHereToPrint"
      >
        <iconify-icon
          class="icon-document-outline"
          icon="ion-document-outline"
          width="21"
        />
        <p class="body-m-semibold primary--text">
          Создать выписку
        </p>
      </v-btn>
      <a
        class="body-m-semibold primary--text"
        href="#"
        @click="activityHelp = true"
      >
        <iconify-icon
          class="icon-question-circle-outlined"
          icon="question-circle-outlined"
          width="21"
        />
        <p class="body-m-semibold primary--text">Неактивные кнопки списания и начисления?</p>
      </a>
    </div>

    <!-- ВЫПИСКА -->
    <div
      v-if="showDetail"
      id="content"
    >
      <p>#########################</p>
      <p>Выписка по бонусным операциям</p>
      <p>#########################</p>
      <p>Состояние счета</p>
      <p
        v-for="(bonus, index) in accountBalances"
        :key="'accountBalances_' + index"
      >
        {{ bonus.name }}: {{ bonus.balance }}
        {{
          getUnitNameEnding(
            bonus.balance,
            bonus.ending["unit_name_ending"],
            bonus.name
          )
        }}
      </p>

      <div
        v-for="(item, i) in transactions"
        :key="'transactions_' + i"
      >
        <div v-if="item.created_at.split('T')[0] >= dataCheck">
          <p v-if="item.created_at.split('T')[0] >= dataCheck">
            #########################
          </p>
          <p>
            {{
              item.created_at
                .slice(0, 19)
                .replace("T", " ")
                .split(" ")[0]
            }}
            в
            {{
              item.created_at
                .slice(0, 19)
                .replace("T", " ")
                .split(" ")[1]
            }}
          </p>
          <p>
            {{ item.direction == "FROM" ? "Списано" : "Начислено" }}:
            <br>
            {{ item.bonus_unit }}: {{ item.value }}
            {{
              getUnitNameEnding(
                item.value,
                accountBalances.filter(
                  element => element.name == item.bonus_unit
                )[0].ending["unit_name_ending"],
                accountBalances.filter(
                  element => element.name == item.bonus_unit
                )[0].name
              )
            }}
          </p>
          <p v-if="item.direction == 'TO'">
            Срок истечения:
            {{
              item.expire_at
                ? item.expire_at.slice(0, 19).replace("T", " ")
                : "нет"
            }}
          </p>
          <p v-if="item.comment">
            Комментарий: {{ item.comment }}
          </p>
        </div>
      </div>
    </div>

    <!-- ПОМОЩЬ -->
    <v-dialog
      v-model="activityHelp"
      max-width="550"
      @click:outside="activityHelp = false"
    >
      <v-card>
        <div class="activity-help-content">
          <div class="body-l-semibold">
            Почему у меня неактивные кнопки “Начислить” или “Списать”?
          </div>

          <div style="margin: 20px 0 0 0;">
            Чтобы появилась возможность ручного начисления или списания бонусов необходимо создать бонусные операции с типом “Начисление” и “Списание”.
          </div>

          <div>
            Сделать это можно в разделе настройки <router-link to="/loyalty">
              программы лояльности
            </router-link>.
          </div>

          <div
            class="body-l-semibold"
            style="margin: 20px 0;"
          >
            Добавление возможности Начисления бонусов.
          </div>

          <ol>
            <li>Создайте бонусную операцию с типом “Начиление”.</li>
            <li>Заполните название бонусной операции.</li>
            <li>Заполните описание бонусной операции для клиента.</li>
            <li>Выберите валюту счета.</li>
            <li>Выберите “Правило срабатывания” с типом “Ручное использование”.</li>
            <li>Поставьте галочку “Включить для менеджеров”.</li>
          </ol>

          <div
            class="body-l-semibold"
            style="margin: 20px 0;"
          >
            Добавление возможности Списания бонусов.
          </div>

          <ol>
            <li>Создайте бонусную операцию с типом “Списание”.</li>
            <li>Заполните название бонусной операции.</li>
            <li>Заполните описание бонусной операции для клиента.</li>
            <li>Выберите валюту счета.</li>
            <li>Выберите “Правило срабатывания” с типом “Ручное использование”.</li>
            <li>Поставьте галочку “Включить для менеджеров”.</li>
          </ol>

          <v-card-actions style="margin-top: 20px;">
            <v-spacer />
            <v-btn
              text
              @click="activityHelp = false"
            >
              Закрыть
            </v-btn>
          </v-card-actions>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import BonusAccount from '@/views/crm/client/components/BonusAccount'
  import { mask } from 'vue-the-mask'

  export default {
    directives: { mask },
    components: {
      BonusAccount,
    },
    props: {
      clientData: {
        type: Object,
        default: () => {
          return {
          }
        },
      },
    },
    data () {
      return {
        loading: false,
        activityHelp: false,
        showDetail: false,
      }
    },
    computed: {
      accountBalances () {
        const result = this.$store.getters['crm/clientCard/accountBalances']
        result.forEach(item => {
          if (!item.max_value) {
            item.icon = null
          }
        })
        return result
      },
      transactions () {
        return this.$store.getters['crm/clientCard/transactions']
      },
      dataCheck () {
        const date = new Date()
        /// ///console.log(date.setDate(date.getDate() - 30));
        date.setDate(date.getDate() - 30)
        return date.toISOString().split('T')[0]
      },
    },
    async created () {
      await this.getDetail()
    },
    methods: {
      getLastActivity (date) {
        if (date) return 'Был(а) в сети ' + this.$moment.utc(date).local().format(this.$config.date.DATETIME_FORMAT_MIN2)
        return 'Был(а) в сети - '
      },
      getUnitNameEnding (iNumber, aEndings, name) {
        aEndings = JSON.parse(aEndings)
        if (
          aEndings === '' ||
          aEndings == null ||
          aEndings.first === '' ||
          aEndings.first == null
        ) {
          return name
        }

        var sEnding, i
        iNumber = iNumber % 100
        if (iNumber >= 11 && iNumber <= 19) {
          sEnding = aEndings.third
        } else {
          i = iNumber % 10
          switch (i) {
            case 1:
              sEnding = aEndings.first
              break
            case 2:
            case 3:
            case 4:
              sEnding = aEndings.second
              break
            default:
              sEnding = aEndings.third
          }
        }

        return sEnding
      },
      clickHereToPrint () {
        let dispSetting = 'toolbar=yes,location=no,directories=yes,menubar=yes,'
        dispSetting += 'scrollbars=yes,width=900, height=700, left=100, top=25'
        const contentValue = document.getElementById('content').innerHTML

        const docprint = window.open('', '', dispSetting)
        docprint.document.open()
        docprint.document.write('<html><head><title>Testing</title>')
        docprint.document.write(
          '</head><body onLoad="self.print()" style="width: 800px; font-size: 13px; font-family: arial;">',
        )
        docprint.document.write(contentValue)
        docprint.document.close()
        docprint.focus()
      },
      async getDetail () {
        try {
          this.loading = true
          await this.$store.dispatch('crm/clientCard/transactionsList', this.clientData)
          this.showDetail = true
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
#content {
  display: none;
  size: A4;
  margin: 0;
  width: 210mm;
  height: 297mm;
}

.activity-help-content {
  padding: 25px;
}
</style>

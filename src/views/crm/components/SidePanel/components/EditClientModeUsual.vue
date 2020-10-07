<template>
  <div>
    <div class="mode-usual__contacts">
      <div class="contacts__block-right">
        <div class="contacts-full_name">
          <p class="title-m-bold">
            {{ clientData.name || '-' }}
          </p>
          <p class="title-m-bold">
            {{ clientData.lastname || '-' }}
          </p>
        </div>
        <div class="contacts-online">
          <p class="body-s-semibold neutral-600--text">
            {{ getLastActivity(clientData.last_activity) }}
          </p>
        </div>
        <div class="contacts-info">
          <ul class="contacts-info__list">
            <li class="contacts-info__item">
              <iconify-icon
                class="info__item-icon"
                icon="ion-phone-portrait-outline"
                width="21"
              />
              <p class="body-m-medium neutral-700--text">
                {{ clientData.phone || '-' }}
              </p>
            </li>
            <li class="contacts-info__item">
              <iconify-icon
                class="info__item-icon"
                icon="ion-mail-outline"
                width="21"
              />
              <p class="body-m-medium neutral-700--text">
                {{ clientData.email || '-' }}
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
      </div>
      <div class="contacts__block-left">
        <img
          :src="[clientData.avatar || '']"
        >
      </div>
    </div>
    <bonus-account />
    <div class="mode-usual__panel-btn">
      <v-btn class="panel-btn">
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
      >
        <iconify-icon
          class="icon-question-circle-outlined"
          icon="question-circle-outlined"
          width="21"
        />
        <p class="body-m-semibold primary--text">Неактивные кнопки списания и начисления?</p>
      </a>
    </div>
  </div>
</template>

<script>
  import BonusAccount from './BonusAccount'
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
          return {}
        },
      },
    },
    data () {
      return {}
    },
    methods: {
      getLastActivity (date) {
        if (date) return 'Был(а) в сети ' + this.$moment.utc(date).local().format(this.$config.date.DATETIME_FORMAT_MIN2)
        return 'Был(а) в сети - '
      },
    },
  }
</script>

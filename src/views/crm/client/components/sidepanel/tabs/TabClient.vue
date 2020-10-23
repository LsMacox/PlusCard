<template>
  <div>
    <bonus-account />
    <div class="tab-client tab-client__info">
      <ul class="info-list">
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            ID пользователя
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">{{ user.id }}</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Зарегистрирован
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">{{ this.$moment.utc(user.created_at).local().format(this.$config.date.DATETIME_FORMAT_MIN2) }}</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Город
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">{{ user.city ? user.city : '-' }}</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Дата рождения
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">{{ user.birthday ? this.$moment.utc(user.birthday).local().format(this.$config.date.DATETIME_FORMAT_MIN2) : '-' }}</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Пол
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">{{ getGender(user.gender) }}</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Телефон
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">{{ user.phone ? user.phone : '-' }}</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Email
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">{{ user.email ? user.email : '-' }}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="tab-client tab-client__segment">
      <div class="tab-client__head segment__head">
        <p class="body-l-semibold neutral-900--text">
          Сегменты
        </p>
        <p class="body-m-regular neutral-700--text">
          Выберите к каким сегментам относится клиент.
        </p>
      </div>
      <div class="tab-client__content segment__content">
        <base-combobox
          v-model="clientSegments"
          not-found-placeholder="Сегменты не найдены!"
          :items="segments"
          item-value="id"
          item-text="name"
        />
      </div>
    </div>
    <div class="tab-client tab-client__user">
      <div class="tab-client__head user__head">
        <p class="body-l-semibold neutral-900--text">
          Имя пользователя
        </p>
        <p class="body-m-regular neutral-700--text">
          Если вам нужно реальное имя клиента, указанное в паспорте, введите его в поле ниже.
        </p>
      </div>
      <div class="tab-client__content user__content">
        <base-text-field
          v-model="clientData.client_name"
          placeholder="Введите реальное имя клиента"
          validation-placement="left"
        />
      </div>
    </div>
    <div class="tab-client tab-client__birthday">
      <div class="tab-client__head birthday__head">
        <p class="body-l-semibold neutral-900--text">
          Дата рождения
        </p>
        <p class="body-m-regular neutral-700--text">
          Если вам нужна реальная дата рождения клиента, указанная в паспорте, введите её в поле ниже.
        </p>
      </div>
      <div class="tab-client__content birthday__content">
        <base-date-text-field
          v-model="clientData.birthday"
          placeholder="Дата рождения клиента (дд.мм.гггг)"
        />
      </div>
    </div>
    <v-btn
      class="btn-success"
      color="primary"
      :loading="loading"
      :disabled="false"
      @click="accountUpdate()"
    >
      <iconify-icon
        class="icon-success"
        icon="ion-checkmark-circle-outline"
        width="21"
      />
      <p class="body-m-semibold mb-0">
        Сохранить
      </p>
    </v-btn>
  </div>
</template>

<script>
  import BonusAccount from '@/views/crm/client/components/BonusAccount'

  export default {
    name: 'TabClient',
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
      return {
        loading: false,
        clientSegments: [],
      }
    },
    computed: {
      user () {
        return this.$store.getters['crm/clientCard/user']
      },
      segments () {
        return this.$store.getters['crm/segment/segments']
      },
    },
    async created () {
      this.clientSegments = Object.copy(this.clientData.segments)
    },
    methods: {
      getGender (gender) {
        if (gender === 'm') return 'мужской'
        if (gender === 'f') return 'женский'
        return '-'
      },
      async accountUpdate () {
        try {
          this.loading = true
          const payload = {
            id: this.clientData.id,
            client_name: this.clientData.client_name,
            birthday: this.clientData.birthday,
            segments: this.clientSegments.map(item => item.id),
          }
          console.log(payload)
          await this.$store.dispatch('crm/client/updateAccount', payload)
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
.tab-client {
  .tab-client__head {
    margin-top: 34px;
    p:nth-child(1) {
      margin-bottom: 6px;
    }
    p:nth-child(2) {
      margin-bottom: 20px;
    }
  }
}
.tab-client__info {
  margin-top: 36px;
}
.info-item {
  p {
    position: relative;
    top: 3px;
  }
  &:nth-child(2) {
    margin-bottom: 24px !important;
  }
}
.btn-success {
  margin-top: 34px;
  margin-bottom: 34px;
  vertical-align: middle;
  .icon-success {
    margin-right: 10px;
  }
}
</style>

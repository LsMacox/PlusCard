<template>
  <div class="tab-client">
    <bonus-account />
    <div class="tab-client__block tab-client__info">
      <ul class="info-list">
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            ID пользователя
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">103112</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Зарегистрирован
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">23 июля, 2020 в 14:20</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Город
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">Body M</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Дата рождения
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">-</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Пол
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">-</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Телефон
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">-</span>
          </div>
        </li>
        <li class="info-item">
          <p class="body-s-semibold neutral-900--text">
            Email
          </p>
          <div class="right-text">
            <span class="body-m-medium neutral-700--text">-</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="tab-client__block tab-client__segment">
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
          v-model="segments"
          not-found-placeholder="Сегменты не найдены!"
          :items="segmentItems"
        />
      </div>
    </div>
    <div class="tab-client__block tab-client__user">
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
          v-model="userName"
          placeholder="Введите реальное имя клиента"
          :rules="userRules"
          validation-placement="left"
        />
      </div>
    </div>
    <div class="tab-client__block tab-client__birthday">
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
          v-model="userBirthday"
          placeholder="Дата рождения клиента (дд.мм.гггг)"
        />
      </div>
    </div>
    <v-btn
      class="btn-success"
      color="primary"
      :disabled="!validate"
      @click="edit"
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
  import BonusAccount from '../../BonusAccount'

  export default {
    name: 'TabClient',
    components: {
      BonusAccount,
    },
    data () {
      return {
        userBirthday: '',
        userName: '',
        segments: [],
        validate: false,
        segmentItems: [
          { id: 1, color: '#ff008a', name: 'Gaming' },
          { id: 2, color: '#00d15d', name: 'Programming' },
          { id: 3, color: '#ff008a', name: 'Vue' },
          { id: 4, color: '#00d15d', name: 'Vuetify' },
          { id: 5, color: '#00d15d', name: 'Vuetify' },
          { id: 6, color: '#00d15d', name: 'Vuetify' },
          { id: 7, color: '#00d15d', name: 'Vuetify' },
          { id: 8, color: '#00d15d', name: 'Vuetify' },
        ],
        userRules: [
          v => !!v || 'Обязательно для заполнения',
        ],
      }
    },
    watch: {
      segments (v) {
        this.validator()
      },
      userBirthday () {
        this.validator()
      },
      userName () {
        this.validator()
      },
    },
    mounted () {},
    methods: {
      validator () {
        if (!!this.segments.length && !!this.userName.length && !!this.userBirthday.length) this.validate = true
        else this.validate = false
      },
      edit () {

      },
    },
  }
</script>
<style lang="scss" scoped>
.tab-client {
  .tab-client__block {
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
}
</style>

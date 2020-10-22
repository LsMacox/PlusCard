<template>
  <div>
    <base-tooltip
      :activator="$refs.bonusUnitSelectBtn"
      :value="showError && !!errorMessageText"
      :disabled="!errorMessageText"
      :text="errorMessageText"
      color="error"
      :open-on-hover="true"
      :open-on-click="false"
      :open-on-focus="false"
      top
    />
    <v-menu offset-y>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          ref="bonusUnitSelectBtn"
          v-bind="attrs"
          outlined
          full-width
          :class="{
            'custom-drop-down': true,
            'border-bottom-not-round': attrs['aria-expanded'] === 'true',
            'error-input': showError && errorMessageText,
          }"
          :disabled="disabled"
          v-on="on"
        >
          <span>{{ selectedItem ? selectedItem.name : 'Выберите валюту' }}</span>

          <v-icon
            right
            :color="!disabled ? 'primary' : null"
            style="height: 21px; width: 21px;"
          >
            {{ attrs['aria-expanded'] === 'false' ? '$iconify_octicon-triangle-down-24' : '$iconify_octicon-triangle-up-24' }}
          </v-icon>
        </v-btn>
      </template>
      <v-list class="list-own-padding">
        <v-list-item
          v-for="(item, index) in bonusListMap"
          :key="index"
          @click="internalValue = item.id"
          @mouseover="item.setting = true"
          @mouseleave="item.setting = false"
        >
          <v-list-item-title>
            <div class="item-select">
              {{ item.name }} <img
                v-if="item.id === internalValue && !item.setting"
                src="@/icons/svg/check.svg"
              >
              <img
                v-if="item.setting"
                src="@/icons/svg/settings.svg"
                @click="openBonusUnitDialog(item)"
              >
            </div>
          </v-list-item-title>
        </v-list-item>
      </v-list>
      <v-list class="list-own-padding">
        <div
          class="btn-inside-select"
          @click="createBonusesCurrency"
        >
          <img src="@/icons/svg/plus-circle.svg">
          Добавить новую валюту
        </div>
      </v-list>
    </v-menu>
  </div>
</template>
<script>
  import Vue from 'vue'

  export default {
    name: 'BonusUnitSelect',
    model: {
      prop: 'value',
      event: 'change',
    },
    props: {
      value: {
        type: Number,
        default: null,
      },
      bonusUnitList: {
        type: Array,
        default: () => [],
      },
      disabled: Boolean,
      showError: Boolean,
      errorMessage: {
        type: [String, Boolean],
        default: undefined,
      },
    },
    data () {
      return {
        internalValue: this.value,
      }
    },
    computed: {
      errorMessageText () {
        return this.errorMessage !== true ? this.errorMessage : ''
      },
      bonusListMap () {
        return this.bonusUnitList.map(item => {
          Vue.set(item, 'setting', false)
          return item
        })
      },
      selectedItem () {
        const index = this.bonusListMap.findIndex(item => item.id === this.internalValue)
        return index >= 0 ? this.bonusListMap[index] : null
      },
    },
    watch: {
      value (v) {
        this.internalValue = v
      },
      internalValue (v) {
        this.$emit('change', v)
      },
    },
    methods: {
      createBonusesCurrency () {
        this.openBonusUnitDialog(null)
      },
      openBonusUnitDialog (bonusUnit) {
        this.$emit('bonus-unit-dialog', bonusUnit)
      },
    },

  }
</script>
<style scoped lang="scss">
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";

  .time-bonuses {
    height: 46px;
  }
  .list-own-padding {
    padding: 0;
  }
  .save-currency {
    padding: 34px 88px;
    border-top: 1px solid #E8E8ED;
  }
  .tab-basic {
    margin-bottom: 12px;
    border: 1px solid #F2F2F7;
    box-sizing: border-box;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    box-shadow: 0px 24px 20px -16px rgba(88, 93, 106, 0.1);
  }
  .title-basic {
    display: flex;
    align-items: center;
    .img-bag {
      margin-right: 22px;
    }
  }
  .small-circle-input {
    width: 20px;
    height: 20px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: center;
  }
  .small-circle-input:first-child {
    margin-left: 20px;
  }
  .container-input-count {
    display: flex;
    align-items: center;
  }
  .container-input-counter {
    display: flex;
    align-items: center;
  }
  .input-big-name {
    margin-top: 12px;
  }
  .mess-wrap {
    display: flex;
    padding: 34px 30px;
    border-bottom: 1px solid #E8E8ED;
  }
  .wrap-circle {
    display: flex;
    align-items: center;
    margin-left: 20px;
  }
  .simple-circle {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #EBF1FF;
    border-radius: 16px;
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
  .mines-right {
    margin-right: 12px;
  }
  .magazine-wrap {
    padding: 34px 30px;
    display: flex;
  }
  .step {
    margin-right: 30px;
    font-size: 15px;
    color: #4776E6;
    line-height: 21px;
    width: 50px;
    height: 30px;
    border-radius: 20px;
    border: 1px solid #EBF1FF;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .shopping-inp {
    margin-right: 12px;
  }
  .plus-circle {
    margin-right: 10px;
  }
  .select-input-wrap {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
  .wrap-input {
    margin-top: 20px;
    display: flex;
    align-items: center;
  }
  .disabled-block {
    pointer-events: none;
    opacity: 0.4;
  }
  .custom-drop-down {
    border: 1px solid #D7D7E0;
    max-width: 420px;
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-transform: none;
    &.error-input{
      border-color: $error;
    }
  }
  .custom-drop-down:focus {
    outline: none;
  }
  .hide-img {
    display: none;
  }
  .border-bottom-not-round {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .item-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .v-list-item:hover {
    background: #EBF1FF;
    color: #2A2A34;
  }
  .btn-inside-select {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 14px;
    border-top: 1px solid #E8E8ED;
    cursor: pointer;
    color: #4776E6;
  }
  .btn-inside-select img {
    margin-right: 6px;
  }
  .first-step-switch {
    display: flex;
    align-items: center;
  }
</style>

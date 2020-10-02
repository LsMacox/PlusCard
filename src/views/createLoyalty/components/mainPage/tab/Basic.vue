<template>
  <div class="switch-control">
    <div
      class="container-switch"
    >
      <div
        class="switch-wrap"
        :class=" switchBagOn ? 'active-switch' : ''"
      >
        <div class="img-title">
          <v-img
            class="img-simple"
            src="@/assets/png/Bag-On.png"
          />
          <div>
            <h3 class="title-h3">
              <span @click="switchBagOn = !switchBagOn">Начисление и списание</span>
            </h3>
            <p class="desc-15 color-text-grey">
              Правила начисления и списания бонусов при совершении покупок
            </p>
          </div>
        </div>
        <div>
          <v-switch
            v-if="false"
            v-model="switchBagOn"
            inset
            class="custom-switch"
          />
        </div>
      </div>
      <accrual-writing
        v-if="switchBagOn"
        v-on="$listeners"
        @saveChangeAccrual="saveChangeAccrual"
      />
    </div>
    <div
      class="container-switch"
    >
      <div class="switch-wrap">
        <div class="img-title">
          <img
            class="img-simple"
            src="@/assets/svg/Darts-Off.svg"
          >
          <div>
            <h3 class="title-h3">
              <span @click="switchDart = !switchDart">N-я покупка в подарок</span>
            </h3>
            <p class="desc-15 color-text-grey">
              Например, каждая 5-я кружка кофе в подарок.
            </p>
          </div>
        </div>
        <div>
          <v-switch
            v-model="switchDart"
            inset
            class="custom-switch"
          />
        </div>
      </div>
      <div v-if="switchDart">
        Darts-Off
      </div>
    </div>
    <div
      class="container-switch"
    >
      <div class="switch-wrap">
        <div class="img-title">
          <img
            class="img-simple"
            src="@/assets/svg/Megaphone-Off.svg"
          >
          <div>
            <h3 class="title-h3">
              <span @click="switchMegaphone = !switchMegaphone">Приветственные бонусы</span>
            </h3>
            <p class="desc-15 color-text-grey">
              Начисляются при регистрации клиента программе лояльности.
            </p>
          </div>
        </div>
        <div>
          <v-switch
            v-model="switchMegaphone"
            inset
            class="custom-switch"
          />
        </div>
      </div>
      <div v-if="switchMegaphone">
        Megaphone-Off
      </div>
    </div>
    <div
      class="container-switch"
    >
      <div class="switch-wrap">
        <div class="img-title">
          <img
            class="img-simple"
            src="@/assets/svg/Party-Off.svg"
          >
          <div>
            <h3 class="title-h3">
              <span @click="switchParty = !switchParty">День рождения</span>
            </h3>
            <p class="desc-15 color-text-grey">
              Начисляются в качестве подарка на день рождения клиента.
            </p>
          </div>
        </div>
        <div>
          <v-switch
            v-model="switchParty"
            inset
            class="custom-switch"
          />
        </div>
      </div>
      <div v-if="switchParty">
        Party-Off
      </div>
    </div>
    <div
      class="container-switch"
    >
      <div class="switch-wrap">
        <div class="img-title">
          <img
            class="img-simple"
            src="@/assets/svg/Stats-Off.svg"
          >
          <div>
            <h3 class="title-h3">
              <span @click="switchStats = !switchStats">Реферальные бонусы</span>
            </h3>
            <p class="desc-15 color-text-grey">
              Начисления за установки приложений, первые покупки и т.д.
            </p>
          </div>
        </div>
        <div>
          <v-switch
            v-model="switchStats"
            inset
            class="custom-switch"
          />
        </div>
      </div>
      <div v-if="switchStats">
        Stats-Off
      </div>
    </div>
  </div>
</template>

<script>
  import AccrualWriting from '../BonusSettingBlocks/BuyBonusSettings'
  import { mapMutations, mapGetters } from 'vuex'
  export default {
    name: 'Basic',
    components: {
      AccrualWriting,
    },
    data () {
      return {
        switchBagOn: true,
        switchDart: false,
        switchMegaphone: false,
        switchParty: false,
        switchStats: false,
      }
    },
    computed: {
      ...mapGetters({
        existsBuyBonusResActive: 'company/bonus_resources/existsBuyBonusResActive',
      }),
    },
    watch: {
      switchBagOn (val) {
        if (!val) {
          this.resetState()
        }
      },
    },
    methods: {
      ...mapMutations(
        {
          resetState: 'createBonusesCurrency/create_bonuses_currency/resetState',
        }),

      saveChangeAccrual (val) {
        this.switchBagOn = val
      },
      openBonusUnitDialog (bonusUnit) {
        this.$emit('bonus-unit-dialog', bonusUnit)
      },
    },

  }
</script>

<style scoped>
  .switch-control {
    margin-top: 20px;
  }
  .switch-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    height: 90px;
    box-shadow: 0px 24px 20px -16px rgba(88, 93, 106, 0.1);
    border-radius: 10px;
    border: 1px solid #F2F2F7;
    padding: 20px;
  }
  .active-switch {
    margin-bottom: 0;
    box-shadow: 0 0 0;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
  .img-title {
    display: flex;
    align-items: center;
  }
  .img-simple {
    margin-right: 22px;
    width: 47px;
    height: 47px;
  }
  .title-h3 span {
    cursor: pointer;
  }
</style>

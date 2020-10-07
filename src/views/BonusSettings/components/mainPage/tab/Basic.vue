<template>
  <div class="switch-control">
    <div
      v-for="(bonusResBlock, index) in bonusResBlocks.toList()"
      :key="index"
      class="container-switch"
    >
      <div class="switch-wrap">
        <div class="img-title">
          <img
            class="img-simple"
            :src="bonusResBlock.curIcon()"
          >
          <div>
            <h3 class="title-h3">
              <span @click="bonusResBlock.expand = !bonusResBlock.expand">{{ bonusResBlock.title }}</span>
            </h3>
            <p class="desc-15 color-text-grey">
              {{ bonusResBlock.desc }}
            </p>
          </div>
        </div>
        <div>
          <v-switch
            v-if="bonusResBlock.activeSwitchShow"
            v-model="bonusResBlock.active"
            :loading="bonusResBlock.action"
            inset
            class="custom-switch"
            @change="(v) => { activeChange(bonusResBlock, v) }"
          />
        </div>
      </div>
      <component
        :is="bonusResBlock.component"
        v-show="bonusResBlock.expand"
      />
    </div>
  </div>
</template>

<script>
  import BuyBonusSettings from '../BonusSettingBlocks/BuyBonusSettings'
  import NewAccountBonusSettings from '../BonusSettingBlocks/NewAccountBonusSettings'
  import BirthDayBonusSettings from '../BonusSettingBlocks/BirthDayBonusSettings'
  import { mapMutations, mapGetters } from 'vuex'

  import { EVENTS_ENUM } from '@/models/enums'

  export default {
    name: 'Basic',
    components: {
      BuyBonusSettings,
      NewAccountBonusSettings,
      BirthDayBonusSettings,
    },
    data () {
      const BonusResBlockTemplate = {
        event: null,
        title: 'title',
        desc: '',
        activeSwitchShow: true,
        active: false,
        expand: false,
        action: false,
        iconOn: require('@/assets/png/Bag-On.png'),
        iconOff: require('@/assets/png/Bag-On.png'),
        curIcon: function () { return this.active ? this.iconOn : this.iconOff },
        component: null,
      }

      return {
        switchBagOn: true,
        switchDart: false,
        switchMegaphone: false,
        switchParty: false,
        switchStats: false,
        // ---

        bonusResBlocks: {

          AccountBuyEvent: Object.assign({}, BonusResBlockTemplate, {
            event: EVENTS_ENUM.AccountBuyEvent,
            title: 'Начисление и списание',
            desc: 'Правила начисления и списания бонусов при совершении покупок',
            active: true,
            expand: true,
            activeSwitchShow: false,
            iconOn: require('@/assets/png/Bag-On.png'),
            iconOff: require('@/assets/png/Bag-On.png'),
            component: BuyBonusSettings,
          }),
          AccountFirstEmissionEvent: Object.assign({}, BonusResBlockTemplate, {
            event: EVENTS_ENUM.AccountFirstEmissionEvent,
            title: 'Приветственные бонусы',
            desc: 'Начисляются при регистрации клиента программе лояльности.',
            iconOn: require('@/assets/settings/Megaphone-On.png'),
            iconOff: require('@/assets/svg/Megaphone-Off.svg'),
            component: NewAccountBonusSettings,
          }),
          AccountClientBirthDayEvent: Object.assign({}, BonusResBlockTemplate, {
            event: EVENTS_ENUM.AccountClientBirthDayEvent,
            title: 'День рождения',
            desc: 'Начисляются в качестве подарка на день рождения клиента.',
            iconOn: require('@/assets/settings/Party-On.png'),
            iconOff: require('@/assets/svg/Party-Off.svg'),
            component: BirthDayBonusSettings,
          }),
          //
          NBuy: Object.assign({}, BonusResBlockTemplate, {
            event: 'NBuy',
            title: 'N-я покупка в подарок',
            desc: 'Например, каждая 5-я кружка кофе в подарок.',
            iconOn: require('@/assets/svg/Darts-Off.svg'),
            iconOff: require('@/assets/svg/Darts-Off.svg'),
          }),
          RefBonus: Object.assign({}, BonusResBlockTemplate, {
            event: 'RefBonus',
            title: 'Реферальные бонусы',
            desc: ' Начисления за установки приложений, первые покупки и т.д.',
            iconOn: require('@/assets/svg/Stats-Off.svg'),
            iconOff: require('@/assets/svg/Stats-Off.svg'),
          }),
          toList () {
            return [
              this.AccountBuyEvent,
              this.AccountFirstEmissionEvent,
              this.AccountClientBirthDayEvent,
            ]
          },
        },

      }
    },
    computed: {
      ...mapGetters({
        existsBuyBonusResActive: 'company/bonus_resources/existsBuyBonusResActive',
      }),
      AccountFirstEmissionBonusResActive: {
        get () {},
        set (v) {

        },
      },
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
      async activeChange (bonusRes, active) {
        // TODO dispach
        try {
          bonusRes.action = true
          await this.$sleep(3000)
        } catch (error) {
          this.$nextTick(() => {
            bonusRes.active = !bonusRes.active
          })
        } finally {
          bonusRes.action = false
        }
      },
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

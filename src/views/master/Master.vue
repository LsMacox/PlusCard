<template>
  <div id="master">
    <div class="app-bar">
      <v-row
        align="center"
        style="min-height: 100px"
      >
        <v-col cols="3">
          <div
            class="nav-block"
            @click="$router.push('/dashboard')"
          >
            <v-icon class="nav-block__icon">
              mdi-arrow-left
            </v-icon>
            <span class="body-s-semibold nav-block__text">Назад</span>
          </div>
        </v-col>
        <v-col cols="9">
          <div class="stepper">
            <div
              class="stepper-block first-step body-l-semibold"
              :style="'color: ' + getCurrentColor('first')"
            >
              Общая информация
            </div>
            <v-icon class="stepper__icon">
              mdi-chevron-right
            </v-icon>
            <div
              class="stepper-block second-step body-l-semibold"
              :style="'color: ' + getCurrentColor('second')"
            >
              Точки продаж
            </div>
            <v-icon class="stepper__icon">
              mdi-chevron-right
            </v-icon>
            <div
              class="stepper-block third-step body-l-semibold"
              :style="'color: ' + getCurrentColor('third')"
            >
              Контактные данные
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
    <div class="progressBar">
      <div
        class="progressLineFirst"
        :style="'width: ' + getCurrentWidth() + '%'"
      />
      <div
        class="progressLineSecond"
        :style="'width: ' + (100 - getCurrentWidth()) + '%'"
      />
    </div>
    <div class="content-wrapper">
      <div class="content-firstStep">
        <div class="content-blocks-wrapper">
          <div class="content-block content-block__first">
            <div class="left-block">
              <div
                class="left-block__title title-m-bold"
                style="color: #2A2A34; margin-bottom: 10px"
              >
                Название
              </div>
              <div
                class="left-block__content body-m-regular"
                style="color: #70707D;"
              >
                Юридическое название компании без кавычек<br> и формы собственности. Есть фирменное <br> название? Отлично! Вводите его.
              </div>
            </div>
            <div class="right-block">
              <v-text-field
                v-model="program.companyName"
                placeholder="Название комании"
                outlined
                counter="20"
                :class="{'success-text': program.companyName.length > 0 && program.companyName.length < 21}"
                :rules="[rules.required, rules.counter]"
                maxlength="20"
              >
                <template v-slot:message="{message}">
                  <span style="color: red">{{ message }}</span>
                </template>
              </v-text-field>
            </div>
          </div>
          <div class="content-block content-block__second">
            <div class="left-block">
              <div
                class="left-block__title title-m-bold"
                style="color: #2A2A34; margin-bottom: 10px"
              >
                Карта клиента
              </div>
              <div
                class="left-block__content body-m-regular"
                style="color: #70707D;"
              >
                Вот так будет выглядеть ваша карта в <br /> приложении. Измените цвет карты кликнув на <br /> ней и загрузите логотип, кликнув по иконке.
              </div>
            </div>
            <div class="right-block">
              <div
                class="card-wrapper"
                   :style="'background: linear-gradient(140deg,'+ program.color[0]+'0% ,'+ program.color[1]+' 99.35%)'"
              >
                <div class="card-topline">
                  <div class="card-topline__companyname title-s-bold">
                    {{ program.companyName ? program.companyName : 'Ваша компания' }}
                  </div>
                  <div class="card-topline__colorchange">
                    <v-img
                      src="@/assets/color-fill-outline.svg"
                      width="21px"
                      height="21px"
                      style="cursor:pointer;"
                    />
                  </div>
                </div>
                <div class="card-bottomline">
                  <div class="bottomline-left">
                    <div
                      class="bottomline-left__number body-s-semibold"
                      style="color: #ffffff"
                    >
                      1234567891236
                    </div>
                    <div class="bottomline-left__balance">
                      <span
                        class="balance__number title-s-bold"
                        style="color: #ffffff"
                      >123 </span>
                      <span
                        class="body-xs-semibold"
                        style="color: rgba(255, 255, 255, 0.5);"
                      >бонуса</span>
                    </div>
                  </div>
                  <div class="bottomline-right">
                    <v-img
                      src="@/assets/logo_change.svg"
                      width="58px"
                      height="58px"
                      style="cursor:pointer;"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Master',
    components: {

    },
    data () {
      return {
        currentStep: 0,
        program: {
          companyName: '',
          color: ['#4776E6', '#8E54E9'],
          logo: '',
        },
        rules: {
          required: value => !!value || this.$t('required'),
          counter: value => value.length <= 20 || 'Max 20 characters',
        },
      }
    },
    methods: {
      getCurrentWidth () {
        console.log('current', this.currentStep)
        if (this.currentStep === 0) return 7
        else if (this.currentStep === 1) return 20

        else if (this.currentStep === 2) return 30
        else return 70
      },
      getCurrentColor (step) {
        if (step === 'first') {
          if (this.currentStep <= 1) return '#8E54E9'
          else return '#2A2A34'
        } else if (step === 'second') {
          if (this.currentStep <= 1) return '#D7D7E0'
          else if (this.currentStep === 2) return '#4776E6'
          else return '#2A2A34'
        } else if (step === 'third') {
          if (this.currentStep <= 2) return '#D7D7E0'
          else if (this.currentStep === 3) return '#4776E6'
          else return '#2A2A34'
        }
      },
    },
  }
</script>

<style lang="sass" scoped>
#master
  height: 100%
  .app-bar
    min-height: 100px
    .nav-block
      width: 84px
      padding-left: 20px
      cursor: pointer
      &__icon, .nav-block__text
        color: #4776E6
    .stepper
      display: flex
      flex-direction: row
      justify-content: space-between
      max-width: 530px
      &__icon
        color: #D7D7E0

  .progressBar
    display: flex
    flex-direction: row
    .progressLineFirst
      height: 1px
      border-radius: 0px 100px 100px 0px
      background: #4776E6
    .progressLineSecond
      height: 1px
      background-color: #F2F2F7

  .content-wrapper
    height: 100%
    overflow-y: scroll
    .content-firstStep
      height: 100%
      .row
        height: 100%
      .content-blocks-wrapper
        display: flex
        height: 100%
        flex-direction: column
        justify-content: center
        align-items: center
        .content-block
          display: flex
          flex-direction: row
          margin-bottom: 68px
          @media(max-width: 992px)
            flex-direction: column
          .right-block
            display: flex
            align-self: flex-end
            .card-wrapper
              height: 152px
              width: 288px
              display: flex
              flex-direction: column
              justify-content: space-between
              align-items: center
              border-radius: 12px
              .card-topline
                display: flex
                flex-direction: row
                justify-content: space-between
                align-items: center
                width: 260px
                padding: 16px 5px 12px 7px
                &__companyname
                  color: #fff
              .card-bottomline
                display: flex
                flex-direction: row
                justify-content: space-between
                width: 260px
                align-items: center
                padding: 12px 5px 12px 7px
              //&__shadow
              //  width: 264px
              //  height: 140px
              //  background: #FFFFFF
              //  box-shadow: 0 7px 50px rgba(0, 22, 38, 0.4)
              //  border-radius: 12px
            @media(max-width: 992px)
              align-self: flex-start
          .left-block
            margin-right: 48px
            display: flex
            flex-direction: column
            align-self: center
            @media(max-width: 992px)
              margin-bottom: 10px
              margin-right: 0

</style>

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
      <div
        v-if="currentStep === 0 || currentStep === 1"
        class="content-firstStep"
      >
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
                Юридическое название компании без кавычек<br> и формы собственности. Есть фирменное <br> название?
                Отлично! Вводите его.
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
                @input="program.companyName.length ? currentStep = 1 : currentStep = 0"
              >
                <template v-slot:message="{message}">
                  <span style="color: #EA4C2A">{{ message }}</span>
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
                Вот так будет выглядеть ваша карта в <br> приложении. Измените цвет карты кликнув на <br> ней и
                загрузите логотип, кликнув по иконке.
              </div>
            </div>
            <div class="right-block">
              <div
                class="card-wrapper"
                :style="'background: linear-gradient(140deg,'+ program.bgcolor[0] + ' 0% ,' + program.bgcolor[1] + ' 99.35%)'"
              >
                <div class="card-bg">
                  <v-img src="@/assets/Shine.svg" />
                </div>
                <div class="card-shadow" />
                <div class="card-main">
                  <div class="card-topline">
                    <div class="card-topline__companyname title-s-bold" :style="'color: ' +program.color">
                      {{ program.companyName ? program.companyName : 'Ваша компания' }}
                    </div>
                    <div class="card-topline__colorchange">
                      <v-menu
                        v-model="colorPickerMenu"
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ on }">
                          <v-img
                            src="@/assets/color-fill-outline.svg"
                            width="21px"
                            height="21px"
                            style="cursor:pointer;"
                            v-on="on"
                          />
                        </template>
                        <div class="colorPickerWrapper">
                          <div class="pa-2">
                            <span class="title-s-bold">Первый цвет</span>
                            <v-color-picker
                              v-model="program.bgcolor[0]"
                              hide-inputs
                              hide-mode-switch
                              flat
                              v-on:input="changeColor"
                            />
                          </div>
                          <div class="pa-2">
                            <span class="title-s-bold">Второй цвет</span>
                            <v-color-picker
                              v-model="program.bgcolor[1]"
                              hide-inputs
                              hide-mode-switch
                              flat
                            />
                          </div>
                        </div>
                      </v-menu>
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
                        v-if="!program.logo"
                        src="@/assets/logo_change.svg"
                        width="58px"
                        height="58px"
                        style="cursor:pointer;border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 50%"
                        @click="$refs.smallImg.click()"
                      />
                      <v-img
                        v-else
                        :src="program.logo"
                        width="58px"
                        height="58px"
                        style="cursor:pointer;border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 50%"
                        @click="$refs.smallImg.click()"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="content-block content-block__third">
            <v-btn
              v-if="program.companyName && program.bgcolor && program.logo"
              color="primary"
              :ripple="false"
              style="width: 123px"
              @click="updateCompany()"
            >
              Далее
              <v-img
                src="@/assets/arrow-forward-outline.svg"
                width="21px"
                height="21px"
                max-width="21px"
              />
            </v-btn>
          </div>
        </div>
      </div>

      <div
        v-if="currentStep === 2"
        class="content-secondStep"
      >
        <div class="">
          <div class="shop-block">
            <div class="shop-block__left">
              <yandex-map
                id="map1"
                :settings="settings"
                :zoom="zoom"
                class="map"
                :coords="coords"
                :scroll-zoom="true"
                :init-without-markers="true"
              >
                <ymap-marker
                  marker-id="1"
                  :coords="coords"
                />
              </yandex-map>
            </div>
            <div class="shop-block__right">
              <div class="content-block">
                <div
                  class="content-block__title title-m-bold"
                  style="color: #2A2A34"
                >
                  Точки продаж
                </div>
                <div
                  class="content-block__description body-m-regular"
                  style="color: #70707D"
                >
                  Если у вас несколько точек продаж - внесите их контактные <br>данные и режимы работы, чтобы клиенты
                  могли связаться с <br>конкретным магазином и уточненить свои вопросы.
                </div>
                <div class="content-block__shop shop-card">
                  <div class="shop-card__name">
                    <v-text-field
                      class="shop-card__name_input"
                      placeholder="Введите название точки"
                    >
                      <template slot="append">
                        <v-btn
                          :ripple="false"
                          fab
                          x-small
                          color="secondary"
                          style="padding: 0 !important; margin: 0 !important"
                        >
                          <v-img
                            src="@/assets/check.svg"
                            max-width="15px"
                            max-height="15px"
                          />
                        </v-btn>
                      </template>
                    </v-text-field>
                  </div>
                  <div class="shop-card__city">
                    <v-select
                      :items="items"
                      placeholder="Выберите город"
                      outlined
                      class="shop-card__city_select"
                      style="width: 380px"
                    >
                      <template slot="prepend-inner">
                        <div>
                          <v-img src="@/assets/building.svg" />
                        </div>
                      </template>
                      <template slot="append">
                        <v-icon
                          color="#4776E6"
                          style="color: #4776E6 !important"
                        >
                          fa-caret-down
                        </v-icon>
                      </template>
                    </v-select>
                  </div>
                  <div class="shop-card__input shop-card__address">
                    <v-text-field
                      placeholder="Введите адрес "
                      outlined
                      style="width: 380px"
                    >
                      <template slot="prepend-inner">
                        <div>
                          <v-img src="@/assets/location-outline.svg" />
                        </div>
                      </template>
                    </v-text-field>
                  </div>
                  <div class="shop-card__input shop-card__phone">
                    <v-text-field
                      placeholder="Введите телефон"
                      outlined
                      style="width: 380px"
                    >
                      <template slot="prepend-inner">
                        <div>
                          <v-img src="@/assets/phone.svg" />
                        </div>
                      </template>
                    </v-text-field>
                  </div>
                  <div class="shop-card__work">
                    <div class="work-block work-time">
                      <div class="work-time__title body-m-semibold">
                        Рабочее время
                      </div>
                      <div class="work-time__inputs" />
                    </div>
                    <div class="break-time">
                      <div class="break-time__title body-m-semibold">
                        Перерыв
                      </div>
                      <div class="break-time__inputs" />
                    </div>
                  </div>
                </div>
                <div class="content-block__add">
                  <v-btn
                    :ripple="false"
                    color="secondary"
                    :text="true"
                    style="padding: 0 !important;"
                  >
                    <v-img
                      src="@/assets/plus-circle.svg"
                      style="margin-right: 5px"
                    />
                    Добавить точку продажи
                  </v-btn>
                </div>
                <div class="content-block__action">
                  <v-btn
                    color="primary"
                    :ripple="false"
                    style="width: 123px"
                  >
                    Далее
                    <v-img
                      src="@/assets/arrow-forward-outline.svg"
                      width="21px"
                      height="21px"
                      max-width="21px"
                    />
                  </v-btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <input
      ref="smallImg"
      type="file"
      class="sr-only"
      name="file"
      accept="image/*"
      hidden
      v-on:change="setSmallImage($event)"
    >
    <image-cropper
      v-if="cropperSmallDialog"
      :p-dialog.sync="cropperSmallDialog"
      :p-title="'Загрузка логотипа'"
      :p-img.sync="smallImg"
      :p-selected.sync="selectedImg"
      :p-aspect-ratio="1"
      :p-circle="true"
    />
  </div>
</template>

<script>
  import ImageCropper from '@/components/dialogs/ImageCropper'
  import { yandexMap, ymapMarker } from 'vue-yandex-maps'
  import Color  from 'color'

  export default {
    name: 'Master',
    components: {
      ImageCropper,
      yandexMap,
      ymapMarker,
      Color
    },
    data () {
      return {
        items: ['Foo', 'Bar', 'Fizz', 'Buzz'],
        settings: {
          apiKey: 'e994d83e-a10e-47e4-bb45-94038d17ba64',
          lang: 'ru_RU',
          coordorder: 'latlong',
          version: '2.1',
        },
        coords: [53.757592, 87.136173],
        zoom: 16,
        cropperSmallDialog: false,
        smallImg: {
          data: null,
          mime: null,
        },
        fileLogo: {
          data: null,
          mime: null,
        },
        selectedImg: null,
        currentStep: 0,
        colorPickerMenu: false,
        program: {
          companyName: '',
          bgcolor: ['#4776E6', '#8E54E9'],
          color: '#FFFFFF',
          logo: null,
        },
        rules: {
          required: value => !!value || this.$t('required'),
          counter: value => value.length <= 20 || 'Max 20 characters',
        },
      }
    },
    watch: {
      smallImg (v) {
        ('currentFile', v);
        if (v.data.indexOf('base64') !== -1) {
          this.fileLogo = {
            data: v.data.split(',')[1],
            mime: 'image/png',
          }
          this.program.logo = v.data
        }

      ('program', this.program)
      },
    },
    methods: {
      changeColor (str) {
        let color = Color(str)
        let alpha, mask
        if (1 - (0.299 * color.color[0] + 0.587 * color.color[1] + 0.114 * color.color[2]) / 255 < 0.5) {
          this.program.bgcolor[1] = color.darken(0.5);
          this.program.color = '#000000';
          alpha = 0.04
          mask = 0
        } else{
          this.program.bgcolor[1] = color.lighten(0.5).hex()
          this.program.color = '#FFFFFF';
          alpha = 0.1;
          mask = 255;
        }
      },
      setMarket (e) {
      },
      changeStep (step) {
        this.currentStep = step
      },
      async updateCompany () {
        const program = Object.assign({}, this.program)
        program.logo = this.fileLogo.data ? this.fileLogo : this.program.logo
        (program)
        // await this.$store.dispatch("brand/company/updateDesign", program)
        this.changeStep(2)
      },
      setSmallImage (e) {
        this.selectedImg = e.target.files[0]
        this.cropperSmallDialog = true
        e.target.type = 'text'
        e.target.type = 'file'
      },
      getCurrentWidth () {
        ('current', this.currentStep)
        if (this.currentStep === 0) {
          return 7
        } else if (this.currentStep === 1) {
          return 20
        } else if (this.currentStep === 2) {
          return 30
        } else {
          return 70
        }
      },
      getCurrentColor (step) {
        if (step === 'first') {
          if (this.currentStep <= 1) {
            return '#8E54E9'
          } else {
            return '#2A2A34'
          }
        } else if (step === 'second') {
          if (this.currentStep <= 1) {
            return '#D7D7E0'
          } else if (this.currentStep === 2) {
            return '#4776E6'
          } else {
            return '#2A2A34'
          }
        } else if (step === 'third') {
          if (this.currentStep <= 2) {
            return '#D7D7E0'
          } else if (this.currentStep === 3) {
            return '#4776E6'
          } else {
            return '#2A2A34'
          }
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
      border-radius: 0 100px 100px 0
      background: #4776E6

    .progressLineSecond
      height: 1px
      background-color: #F2F2F7

  .content-wrapper
    height: calc(100% - 100px)

    .content-firstStep, .content-secondStep
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
              position: relative
              z-index: 1

              .card-bg
                position: absolute
                z-index: 3

              .card-topline
                position: relative
                z-index: 3
                display: flex
                flex-direction: row
                justify-content: space-between
                align-items: center
                width: 260px
                padding: 16px 5px 12px 7px

              .card-bottomline
                position: relative
                z-index: 3
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

.colorPickerWrapper
  display: flex
  flex-direction: row
  position: relative
  z-index: 100
  background: #fff
  @media(max-width: 992px)
    flex-direction: column

.shop-block
  display: flex
  flex-direction: row
  height: calc(100vh - 100px)
  @media(max-width: 992px)
    flex-direction: column
    overflow-y: scroll

  .shop-block__left
    @media(max-width: 992px)
      display: flex
      justify-content: center

    .map
      height: calc(100vh - 100px)
      width: 523px
      margin: 0
      padding: 0

  .shop-block__right
    display: flex
    flex-grow: 1
    justify-content: center
    padding: 68px 0
    overflow-y: scroll
    @media(max-width: 992px)
      overflow-y: visible

    .content-block
      &__title
        margin-bottom: 12px

      &__add
        margin-top: 30px

      &__action
        margin: 70px 0

      .shop-card
        margin-top: 34px
        padding: 34px 24px
        width: 428px
        background: #FFFFFF
        border: 1px solid #F2F2F7
        box-sizing: border-box
        box-shadow: 0 24px 20px -16px rgba(88, 93, 106, 0.1)
        border-radius: 12px

        &__name
          .v-input.theme--light.v-text-field.v-text-field--is-booted
            .v-input__control
              .v-input__slot
                input
                  color: #B5B5C4

        &__city
          &_select
            .v-input__control
            .v-select__slot
              .v-input__append-inner
                .v-input__icon.v-input__icon--append
                  .v-icon
                    color: red !important

        &__input
          margin-top: 16px

        &__work
          margin-top: 34px

          .work-time
            &__title
              color: #2A2A34

          .break-time
            margin-top: 24px

            &__title
              color: #2A2A34

</style>

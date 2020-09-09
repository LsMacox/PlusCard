<template>
  <div>
    <div
      class="content-firstStep"
    >
      <v-container>
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
            <div
              class="right-block"
              style="height: 55px"
            >
              <v-text-field
                v-model="program.name"
                :validate-on-blur="true"
                placeholder="Название комании"
                outlined
                counter="20"
                :class="{'v-input--counter': true,'success-text': program.name.length > 0 && program.name.length < 21}"
                :rules="[rules.required, rules.counter]"
                maxlength="20"
                @input="program.name.length ? currentStep = 1 : currentStep = 0"
              />
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
                :style="'background: linear-gradient(140deg,'+ program.bgcolor[0] + ' 0% ,' + program.bgcolor[1] + ' 99.35%); border: 1px solid ' + getBorderColor()"
              >
                <div class="card-bg">
                  <v-img
                    :src="cardBg"
                    max-width="300px"
                  />
                </div>
                <div class="card-shadow" />
                <div class="card-main">
                  <div class="card-topline">
                    <div
                      class="card-topline__name title-s-bold"
                      :style="'color: ' +program.color"
                    >
                      {{ program.name ? program.name : 'Ваша компания' }}
                    </div>
                    <div class="card-topline__colorchange">
                      <v-menu
                        v-model="colorPickerMenu"
                        :close-on-content-click="false"
                      >
                        <template v-slot:activator="{ on }">
                          <div
                            style="cursor: pointer"
                            v-on="on"
                          >
                            <div
                              v-show="program.color === '#2A2A34'"
                            >
                              <span
                                class="iconify"
                                data-icon="ion:color-fill-outline"
                                data-inline="false"
                                color="#2A2A34"
                              />
                            </div>
                            <div
                              v-show="program.color !== '#2A2A34'"
                              style="cursor: pointer"
                            >
                              <span
                                class="iconify"
                                data-icon="ion:color-fill-outline"
                                data-inline="false"
                                color="#FFFFFF"
                              />
                            </div>
                          </div>
                        </template>
                        <div class="colorPickerWrapper">
                          <div class="pa-2">
                            <v-color-picker
                              v-model="program.bgcolor[0]"
                              hide-mode-switch
                              mode="hexa"
                              flat
                              @input="changeColor"
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
                        :style="'color: ' + program.color"
                      >
                        1234567891236
                      </div>
                      <div class="bottomline-left__balance">
                        <span
                          class="balance__number title-s-bold"
                          :style="'color: ' + program.color"
                        >123 </span>
                        <span
                          class="body-xs-semibold"
                          :style="'color: ' + getUnitColor()"
                        >бонуса</span>
                      </div>
                    </div>
                    <div class="bottomline-right">
                      <div
                        v-if="!program.logo"
                        :style="'cursor: pointer;border: 1px solid '+ getBorderColor() +' ;border-radius: 50%;width: 58px;height: 58px;display: flex;align-items: center;justify-content: center;'"
                        @click="$refs.smallImg.click()"
                      >
                        <span
                          v-show="program.color === '#2A2A34'"
                        >
                          <span
                            class="iconify"
                            data-icon="feather:download"
                            data-inline="false"
                            color="#2A2A34"
                          />
                        </span>
                        <span
                          v-show="program.color !== '#2A2A34'"
                          style="cursor: pointer"
                        >
                          <span
                            class="iconify"
                            data-icon="feather:download"
                            data-inline="false"
                            color="#FFFFFF"
                          />
                        </span>
                      </div>
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
              color="primary"
              style="width: 123px"
              :disabled="!program.name || !program.logo"
              @click="updateCompany()"
            >
              Далее
              <span
                class="iconify"
                data-icon="bi:arrow-right"
                data-inline="false"
                style="margin-left: 7px"
              />
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/programModel']
      },
    },
    methods: {},
  }
</script>

<style lang="scss" scoped>
@import 'form-update.scss';
</style>

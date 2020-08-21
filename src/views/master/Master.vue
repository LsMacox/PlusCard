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
        <div>
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
                  :validate-on-blur="true"
                  placeholder="Название комании"
                  outlined
                  counter="20"
                  :class="{'companyName_input': true,'success-text': program.companyName.length > 0 && program.companyName.length < 21}"
                  :rules="[rules.required, rules.counter]"
                  maxlength="20"
                  @input="program.companyName.length ? currentStep = 1 : currentStep = 0"
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
                  :style="'background: linear-gradient(140deg,'+ program.bgcolor[0] + ' 0% ,' + program.bgcolor[1] + ' 99.35%)'"
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
                        class="card-topline__companyname title-s-bold"
                        :style="'color: ' +program.color"
                      >
                        {{ program.companyName ? program.companyName : 'Ваша компания' }}
                      </div>
                      <div class="card-topline__colorchange">
                        <v-menu
                          v-model="colorPickerMenu"
                          :close-on-content-click="false"
                        >
                          <template v-slot:activator="{ on }">
                            <v-img
                              src="@/assets/svg/color-fill-outline.svg"
                              width="21px"
                              height="21px"
                              style="cursor:pointer;"
                              v-on="on"
                            />
                          </template>
                          <div class="colorPickerWrapper">
                            <div class="pa-2">
                              <v-color-picker
                                v-model="program.bgcolor[0]"
                                hide-mode-switch
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
                          src="@/assets/svg/logo_change.svg"
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
                color="primary"
                style="width: 123px"
                @click="updateCompany()"
              >
                Далее
                <v-img
                  src="@/assets/svg/arrow-forward-outline.svg"
                  width="21px"
                  height="21px"
                  max-width="21px"
                />
              </v-btn>
            </div>
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
                @click="setMarker($event)"
              >
                <ymap-marker
                  #FFFFFF;
                  marker-id="1"
                  :coords="coords"
                  :icon="markerIcon"
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
                <div class="content-block__search">
                  <v-text-field
                    placeholder="Поиск по названию, городу, улице"
                    outlined
                  >
                    <template slot="prepend-inner">
                      <span
                        class="iconify"
                        data-icon="gg:search"
                        data-inline="false"
                      />
                    </template>
                  </v-text-field>
                </div>
                <div class="content-block__shop complete-shop">
                  <div class="complete-shop__header">
                    <div class="header__title body-l-semibold">
                      Магазин №12 на Ленина
                    </div>
                    <div class="actions">
                      <div
                        v-show="!actionsShow"
                        class="more_icons"
                        @mouseover="actionsShow = true"
                      >
                        <span
                          class="iconify"
                          data-icon="feather:more-vertical"
                          data-inline="false"
                        />
                      </div>
                      <div
                        v-show="actionsShow"
                        class="actions_icons"
                        @mouseleave="actionsShow = false"
                      >
                        <span
                          class="iconify trash_icon"
                          data-icon="feather:trash"
                          data-inline="false"
                        />
                        <span
                          class="iconify edit_icon"
                          data-icon="feather:edit"
                          data-inline="false"
                        />
                      </div>
                    </div>
                  </div>
                  <div class="complete-shop__content shop-content">
                    <div class="shop-content__first">
                      <div class="workdays body-m-regular">
                        <span
                          class="iconify"
                          data-icon="feather:calendar"
                          data-inline="false"
                        />
                        Пн-пт, вс
                      </div>
                      <div class="worktime body-m-regular">
                        <span
                          class="iconify"
                          data-icon="feather:clock"
                          data-inline="false"
                        />
                        10:00-22:00
                      </div>
                      <div class="breaktime body-m-regular">
                        <span
                          class="iconify"
                          data-icon="feather:coffee"
                          data-inline="false"
                        />
                        13:00-14:00
                      </div>
                    </div>
                    <div class="shop-content__second">
                      <div class="address body-m-regular">
                        <span
                          class="iconify"
                          data-icon="ion:location-outline"
                          data-inline="false"
                        />
                        Москва, пр-т Ломоносова, 48-а.
                      </div>
                    </div>
                    <div class="shop-content__third">
                      <div class="phone body-m-regular">
                        <span
                          class="iconify"
                          data-icon="feather:phone"
                          data-inline="false"
                        />
                        +7 (950) 748-23-42
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  v-if="newShopActive"
                  class="content-block__shop shop-card"
                >
                  <div class="shop-card__name">
                    <v-text-field
                      v-model="newShop.name"
                      class="shop-card__name_input"
                      placeholder="Введите название точки"
                    />
                  </div>
                  <div class="shop-card__city">
                    <v-select
                      v-model="newShop.city"
                      :items="items"
                      placeholder="Выберите город"
                      outlined
                      class="shop-card__city_select"
                      style="width: 380px;"
                    >
                      <template slot="prepend-inner">
                        <div>
                          <v-img src="@/assets/svg/building.svg" />
                        </div>
                      </template>

                      <template v-slot:item="data">
                        <div style="display: flex; align-items: center;">
                          <div
                            v-if="data.attrs.inputValue"
                            :key="data.item + 'active'"
                            class="active"
                          >
                            <span
                              class="iconify"
                              data-icon="eva:checkmark-square-2-fill"
                              data-inline="false"
                            />
                          </div>
                          <div
                            v-else
                            :key="data.item + 'inactive'"
                            class="inactive"
                          >
                            <span
                              class="iconify"
                              data-icon="eva:square-outline"
                              data-inline="false"
                            />
                          </div>
                          <span>{{ data.item }}</span>
                        </div>
                      </template>
                    </v-select>
                  </div>
                  <div class="shop-card__input shop-card__address">
                    <v-text-field
                      v-model="newShop.address"
                      placeholder="Введите адрес "
                      outlined
                      style="width: 380px"
                    >
                      <template slot="prepend-inner">
                        <div>
                          <v-img src="@/assets/svg/location-outline.svg" />
                        </div>
                      </template>
                    </v-text-field>
                  </div>
                  <div class="shop-card__input shop-card__phone">
                    <v-text-field
                      v-model="newShop.phone"
                      placeholder="Введите телефон"
                      outlined
                      style="width: 380px"
                    >
                      <template slot="prepend-inner">
                        <div>
                          <v-img src="@/assets/svg/phone.svg" />
                        </div>
                      </template>
                    </v-text-field>
                  </div>
                  <div class="shop-card__work">
                    <div class="work-block work-time">
                      <div class="work-time__title body-m-semibold">
                        Рабочее время
                      </div>
                      <div
                        v-for="(worktime, globalIndex) in newShop.workTimes"
                        :key="globalIndex"
                        class="work-time__inputs"
                      >
                        <div class="inputs__first">
                          <v-text-field
                            v-model="worktime.startTime"
                            v-mask="'##:##'"
                            placeholder="00:00"
                            outlined
                            style="width: 74px; margin-right: 4px"
                          />
                        </div>
                        <div
                          class="inputs__separator"
                          style="height: 50px"
                        >
                          -
                        </div>
                        <div class="inputs__second">
                          <v-text-field
                            v-model="worktime.endTime"
                            v-mask="'##:##'"
                            placeholder="По"
                            outlined
                            style="width: 74px;  margin: 0 16px 0 4px"
                          />
                        </div>
                        <div class="inputs__third">
                          <v-select
                            v-model="worktime.days"
                            :items="days"
                            item-value="id"
                            placeholder="Дни"
                            outlined
                            multiple
                            style="width: 155px;margin-right: 18px"
                          >
                            <template v-slot:selection="{item, index}">
                              <div
                                v-if="index === 0"
                                style="font-size: 12px"
                              >
                                {{ getSelectedWorkDays(globalIndex) }}
                              </div>
                            </template>
                            <template v-slot:item="data">
                              <div style="display: flex; align-items: center;">
                                <div
                                  v-if="data.attrs.inputValue"
                                  class="active"
                                >
                                  <span
                                    class="iconify"
                                    data-icon="eva:checkmark-square-2-fill"
                                    data-inline="false"
                                  />
                                </div>
                                <div
                                  v-else
                                  :key="data.item.id"
                                  class="inactive"
                                >
                                  <span
                                    class="iconify"
                                    data-icon="eva:square-outline"
                                    data-inline="false"
                                  />
                                </div>
                                <span>{{ data.item.fullName }}</span>
                              </div>
                            </template>
                          </v-select>
                        </div>
                        <div
                          v-if="newShop.workTimes.length - 1 === globalIndex"
                          class="inputs__action"
                        >
                          <v-btn
                            color="secondary"
                            :text="true"
                            style="padding: 0 !important;"
                            :ripple="false"
                            @click="addWorkTime()"
                          >
                            <span
                              class="iconify"
                              data-icon="uil:plus-circle"
                              data-inline="false"
                              width="21px"
                              heigth="21px"
                            />
                          </v-btn>
                        </div>
                      </div>
                    </div>
                    <div class="break-time">
                      <div class="break-time__title body-m-semibold">
                        Перерыв
                      </div>
                      <div
                        v-for="(breaktime, i) in newShop.breakTimes"
                        :key="i"
                        class="break-time__inputs"
                      >
                        <div class="inputs__first">
                          <v-text-field
                            :ref="'from'+i"
                            v-model="breaktime.startTime"
                            v-mask="'##:##'"
                            placeholder="С"
                            outlined
                            style="width: 74px; margin-right: 4px"
                          />
                        </div>
                        <div
                          class="inputs__separator"
                          style="height: 50px"
                        >
                          -
                        </div>
                        <div class="inputs__second">
                          <v-text-field
                            v-model="breaktime.endTime"
                            v-mask="'##:##'"
                            placeholder="По"
                            outlined
                            style="width: 74px;  margin: 0 16px 0 4px"
                          />
                        </div>
                        <div class="inputs__third">
                          <v-select
                            v-model="breaktime.days"
                            :items="days"
                            placeholder="Дни"
                            item-value="id"
                            outlined
                            multiple
                            style="width: 155px;margin-right: 18px"
                          >
                            <template v-slot:selection="{item, index}">
                              <div
                                v-if="index === 0"
                                style="font-size: 12px"
                              >
                                {{ getSelectedBreakDays(i) }}
                              </div>
                            </template>
                            <template v-slot:item="data">
                              <div style="display: flex; align-items: center;">
                                <div
                                  v-if="data.attrs.inputValue"
                                  :key="data.item.id + 100"
                                  class="active"
                                >
                                  <span
                                    class="iconify"
                                    data-icon="eva:checkmark-square-2-fill"
                                    data-inline="false"
                                  />
                                </div>
                                <div
                                  v-else
                                  :key="data.item.id"
                                  class="inactive"
                                >
                                  <span
                                    class="iconify"
                                    data-icon="eva:square-outline"
                                    data-inline="false"
                                  />
                                </div>
                                <span>{{ data.item.fullName }}</span>
                              </div>
                            </template>
                          </v-select>
                        </div>
                        <div
                          v-if="newShop.breakTimes.length - 1 === i"
                          class="inputs__action"
                        >
                          <v-btn
                            color="secondary"
                            :text="true"
                            style="padding: 0 !important;"
                            :ripple="false"
                            @click="addBreakTime()"
                          >
                            <span
                              class="iconify"
                              data-icon="uil:plus-circle"
                              data-inline="false"
                              width="21px"
                              heigth="21px"
                            />
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="shop-card__actions">
                    <div class="action__cancel">
                      <v-btn
                        :ripple="false"
                        :text="true"
                        color="info"
                        style="width:85px; height: 41px; text-transform: none; font-weight: 600;
font-size: 13px;
line-height: 17px;"
                        @click="cancelShop()"
                      >
                        <v-img
                          src="@/assets/svg/close-circle_grey.svg"
                          style="margin-right: 6px"
                        />
                        Отменить
                      </v-btn>
                    </div>
                    <div class="action__save">
                      <v-btn
                        color="secondary"
                        small
                        style="width: 265px; margin-right: 0"
                      >
                        Сохранить
                      </v-btn>
                    </div>
                  </div>
                </div>
                <div class="content-block__add">
                  <v-btn
                    color="primary"
                    :text="true"
                    style="padding: 0 !important;"
                    @click="addShop()"
                  >
                    <v-img
                      src="@/assets/svg/plus-circle.svg"
                      style="margin-right: 5px"
                    />
                    Добавить точку продажи
                  </v-btn>
                </div>
                <div class="content-block__action">
                  <v-btn
                    color="primary"
                    style="width: 123px"
                    @click="currentStep = 3"
                  >
                    Далее
                    <v-img
                      src="@/assets/svg/arrow-forward-outline.svg"
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

      <div
        v-if="currentStep === 3"
        class="content-thirdStep"
      >
        <div>
          <div class="contacts-block">
            <div class="content-block content-block__first">
              <div class="left-block">
                <div
                  class="left-block__title title-m-bold"
                  style="color: #2A2A34; margin-bottom: 10px"
                >
                  Контактная информация
                </div>
                <div
                  class="left-block__content body-m-regular"
                  style="color: #70707D;"
                >
                  Введите единый номер телефона и адрес <br> вашего сайта, чтобы ваши клиенты могли <br> связаться с вами удобным способом.
                </div>
              </div>
              <div class="right-block">
                <v-text-field
                  placeholder="Номер горячей линии"
                  outlined
                  style="width: 300px;"
                >
                  <template slot="prepend-inner">
                    <span
                      class="iconify"
                      data-icon="feather:phone"
                      data-inline="false"
                    />
                  </template>
                </v-text-field>
                <v-text-field
                  placeholder="Адрес сайта"
                  outlined
                  style="width: 300px;"
                >
                  <template slot="prepend-inner">
                    <span
                      class="iconify"
                      data-icon="feather:mouse-pointer"
                      data-inline="false"
                    />
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
                  Социальные сети
                </div>
                <div
                  class="left-block__content body-m-regular"
                  style="color: #70707D;"
                >
                  Введите адреса ваших профилей и групп в <br> социальных сетях. Вводите только название <br> профиля, которое стоит в самом конце <br> адресной строки после символа “/”.
                </div>
              </div>
              <div class="right-block">
                <v-text-field
                  placeholder="Номер горячей линии"
                  outlined
                  style="width: 300px;"
                >
                  <template slot="prepend-inner">
                    <span
                      class="iconify"
                      data-icon="feather:phone"
                      data-inline="false"
                    />
                  </template>
                </v-text-field>
                <v-text-field
                  placeholder="Адрес сайта"
                  outlined
                  style="width: 300px;"
                >
                  <template slot="prepend-inner">
                    <span
                      class="iconify"
                      data-icon="feather:mouse-pointer"
                      data-inline="false"
                    />
                  </template>
                </v-text-field>
                <v-text-field
                  placeholder="Адрес сайта"
                  outlined
                  style="width: 300px;"
                >
                  <template slot="prepend-inner">
                    <span
                      class="iconify"
                      data-icon="feather:mouse-pointer"
                      data-inline="false"
                    />
                  </template>
                </v-text-field>
                <v-text-field
                  placeholder="Адрес сайта"
                  outlined
                  style="width: 300px;"
                >
                  <template slot="prepend-inner">
                    <span
                      class="iconify"
                      data-icon="feather:mouse-pointer"
                      data-inline="false"
                    />
                  </template>
                </v-text-field>
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
      @change="setSmallImage($event)"
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
  import Color from 'color'
  import { mask } from 'vue-the-mask'

  export default {

    name: 'Master',
    components: {
      ImageCropper,
      yandexMap,
      ymapMarker,
    },
    directives: { mask },
    data () {
      return {
        // markerIcon: {
        //   layout: 'default#imageWithContent',
        //   content: '123 v12',
        //   contentOffset: [0, 15],
        //   contentLayout: '<div class="ymapMarker">$[properties.iconContent]</div>',
        // },
        actionsShow: false,
        markerIcon: {
          layout: 'default#imageWithContent',
          imageHref: require('@/assets/svg/Bottom-tail.svg'),
          imageSize: [150, 55],
          imageOffset: [-75, -50],
          content: '123 v12',
          contentOffset: [0, 0],
          contentLayout: '<div class="markerC lass" style="display: flex; align-self: center; justify-content:center; width: 150px; height: 50px; color: #FFFFFF; font-weight: bold; text-align: center">$[properties.iconContent]</div>',
        },
        newShopActive: false,
        shop: { lat: '', lng: '' },
        shops: [],
        newShop: {
          name: '',
          city: '',
          address: '',
          phone: '',
          workTimes: [
            {
              startTime: '',
              endTime: '',
              days: [],
            },
          ],
          breakTimes: [
            {
              startTime: '',
              endTime: '',
              days: [],
            },
          ],
        },
        newWorkTime: [],
        newBreakTime: [],
        cardBg: require('@/assets/svg/Shine.svg'),
        items: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
        days: [
          { id: 0, shortName: 'ПН', fullName: 'Понедельник' },
          { id: 1, shortName: 'ВТ', fullName: 'Вторник' },
          { id: 2, shortName: 'СР', fullName: 'Среда' },
          { id: 3, shortName: 'ЧТ', fullName: 'Четверг' },
          { id: 4, shortName: 'ПТ', fullName: 'Пятница' },
          { id: 5, shortName: 'СБ', fullName: 'Суббота' },
          { id: 6, shortName: 'ВС', fullName: 'Воскресенье' },
        ],
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
    computed: {
      sorted_work_array () {
        return this.sortById(this.newShop.workTimes)
      },
      sorted_break_array () {
        return this.sortById(this.newShop.breakTimes)
      },
      balloonTemplate () {
        return `
        <h1 class="red">Hi, everyone!</h1>
        <p>I am here: ${this.coords}</p>
        <img src="http://via.placeholder.com/350x150">
      `
      },
    },
    watch: {
      smallImg (v) {
        if (v.data.indexOf('base64') !== -1) {
          this.fileLogo = {
            data: v.data.split(',')[1],
            mime: 'image/png',
          }
          this.program.logo = v.data
        }
      },
    },
    methods: {
      arrayUnique (array) {
        var a = array.concat()
        for (var i = 0; i < a.length; ++i) {
          for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) { a.splice(j--, 1) }
          }
        }

        return a
      },
      getSelectedBreakDays (index) {
        console.log('index', index)
        const array = this.sorted_break_array[index].days
        let str = ''
        let length = 0
        const strArr = []
        for (let i = 0; i < array.length; i++) {
          if (array[i] + 1 === array[i + 1]) {
            if (!str.length) str += this.days[array[i]].shortName
            length += 1
          } else {
            if (length !== 0) {
              str += '-' + this.days[array[i]].shortName
              length = 0
              strArr.push(str)
              str = ''
            } else {
              str += this.days[array[i]].shortName
              strArr.push(str)
              str = ''
            }
          }
        }
        str = ''
        strArr.forEach(item => {
          str += item + ', '
        })
        str = str.slice(0, -2)
        return str
      },
      getSelectedWorkDays (index) {
        console.log('index', index)
        const array = this.sorted_work_array[index].days
        let str = ''
        let length = 0
        const strArr = []
        for (let i = 0; i < array.length; i++) {
          if (array[i] + 1 === array[i + 1]) {
            if (!str.length) str += this.days[array[i]].shortName
            length += 1
          } else {
            if (length !== 0) {
              str += '-' + this.days[array[i]].shortName
              length = 0
              strArr.push(str)
              str = ''
            } else {
              str += this.days[array[i]].shortName
              strArr.push(str)
              str = ''
            }
          }
        }
        str = ''
        strArr.forEach(item => {
          str += item + ', '
        })
        str = str.slice(0, -2)
        return str
      },
      sortById (arr) {
        console.log('input array', arr)
        // arr.sort((a, b) => a.id > b.id ? 1 : -1);
        const array = []
        arr.forEach(item => {
          item.days.sort(function (a, b) {
            return a - b
          })
          array.push(item)
        })
        console.log('output array', array)
        return array
      },
      cancelShop () {
        this.newShopActive = false
        this.newShop = {
          name: '',
          city: '',
          address: '',
          phone: '',
          workTimes: [
            {
              startTime: '',
              endTime: '',
              days: [],
            },
          ],
          breakTimes: [
            {
              startTime: '',
              endTime: '',
              days: [],
            },
          ],
        }
      },
      addShop () {
        this.newShopActive = true
      },
      setMarker (e) {
        this.coords = Object.assign([], e.get('coords'))
        /// ///console.log(this.coords)
        this.shop.lat = this.coords[0]
        this.shop.lng = this.coords[1]
        this.shop = Object.assign({}, this.shop)
      },

      addWorkTime () {
        console.log('current work_times', this.newShop.workTimes)
        const last = this.newShop.workTimes[this.newShop.workTimes.length - 1]
        if (last.days.length === 0 || !last.startTime || !last.endTime) {
          return false
        } else {
          this.newShop.workTimes.push(
            {
              startTime: '',
              endTime: '',
              days: [],
            },
          )
        }
      },
      addBreakTime () {
        console.log('current break_times', this.newShop.breakTimes)
        const last = this.newShop.breakTimes[this.newShop.breakTimes.length - 1]
        if (last.days.length === 0 || !last.startTime || !last.endTime) {
          return false
        } else {
          this.newShop.breakTimes.push(
            {
              startTime: '',
              endTime: '',
              days: [],
            },
          )
        }
      },
      changeColor (str) {
        const color = Color(str)
        if (color.isLight()) {
          this.program.bgcolor[1] = color.darken(0.5).hex()
          this.program.color = '#000000'
        } else {
          this.program.bgcolor[1] = color.lighten(0.5).hex()
          this.program.color = '#FFFFFF'
        }
      },
      changeStep (step) {
        this.currentStep = step
      },
      async updateCompany () {
        const program = Object.assign({}, this.program)
        program.logo = this.fileLogo.data ? this.fileLogo : this.program.logo
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
<style lang="sass">
  .ymapMarker
    width: 150px
    height: 50px
    background: #4776E6
    border-radius: 8px
    opacity: .3

</style>

<style lang="sass" scoped>
@import '~@/sass/plus_ui/light_theme/_variables.sass'
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

    .content-firstStep, .content-secondStep, .content-thirdStep
      height: 100%

      .row
        height: 100%

      .content-blocks-wrapper
        display: flex
        flex-direction: column
        height: 100vh
        justify-content: center
        align-items: center
        @media(max-width: 992px)
          height: calc(100vh - 100px)
          flex-direction: column
          justify-content: flex-start
          overflow-y: scroll

        .content-block
          display: flex
          flex-direction: row
          margin-bottom: 68px
          @media(max-width: 992px)
            flex-direction: column

          .right-block
            display: flex
            align-self: flex-end
            width: 300px

            .card-wrapper
              height: 152px
              width: 300px
              display: flex
              flex-direction: column
              justify-content: space-between
              align-items: center
              border-radius: 12px
              position: relative
              z-index: 1

              .card-bg
                width: 100%
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
            width: 333px
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
  z-index: 1000
  background: #fff
  @media(max-width: 992px)
    flex-direction: column

.complete-shop
  background: $neutral-100
  border: 1px solid #F2F2F7
  box-shadow: 0px 24px 20px -16px rgba(88, 93, 106, 0.1)
  border-radius: 12px
  padding: 26px 24px
  margin-top: 20px
  &__header
    display: flex
    flex-direction: row
    justify-content: space-between
    color: $neutral-900
    .iconify
      width: 21px
      height: 21px
      cursor: pointer
      color: $neutral-500
    .actions_icons
      .trash_icon
        color: $error-500
        margin-right: 15px
      .edit_icon
        color: $primary-base
  .shop-content
    &__first
      display: flex
      flex-direction: row
      justify-content: space-between
      align-items: center
      color: $neutral-700
      margin: 12px 0 16px 0
      .iconify
        color: $primary-base
        width: 21px
        height: 21px
        margin-right: 10px
      .workdays,.worktime, .breaktime
        display: flex
    &__second
      display: flex
      flex-direction: row
      justify-content: space-between
      align-items: center
      color: $neutral-700
      margin: 12px 0 16px 0
      .iconify
        color: $neutral-500
        width: 21px
        height: 21px
        margin-right: 10px
      .address
        display: flex
    &__third
      display: flex
      flex-direction: row
      justify-content: space-between
      align-items: center
      color: $neutral-700
      .iconify
        color: $neutral-500
        width: 21px
        height: 21px
        margin-right: 10px
      .phone
        display: flex
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

      &__search
        margin-top: 34px

      &__add
        margin-top: 30px

      &__action
        margin: 70px 0

      .shop-card
        margin-top: 34px
        padding: 18px 24px 34px 24px
        width: 428px
        background: #FFFFFF
        border: 1px solid #F2F2F7
        box-sizing: border-box
        box-shadow: 0 24px 20px -16px rgba(88, 93, 106, 0.1)
        border-radius: 12px
        transition: 2s ease-in-out all
        &__actions
          margin-top: 35px
          display: flex
          flex-direction: row
          align-items: center
          justify-content: space-between
          .action__cancel
            button
              .v-btn
                .v-btn__content
                  color: #B5B5C4 !important
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
            &__inputs
              display: flex
              flex-direction: row
              align-items: center
              margin-top: 12px
              .inputs__action
                height: 50px
                display: flex
                margin: 0
                align-items: flex-start
                position: relative
                left: -25px
                .iconify
                  width: 21px
                  height: 21px

          .break-time
            margin-top: 24px

            &__title
              color: #2A2A34
            &__inputs
              display: flex
              flex-direction: row
              align-items: center
              margin-top: 12px
              .inputs__action
                height: 50px
                display: flex
                margin: 0
                align-items: flex-start
                position: relative
                left: -25px
                .iconify
                  width: 21px
                  height: 21px

.contacts-block
  display: flex
  flex-direction: column
  height: calc(100vh - 100px)
  @media(max-width: 992px)
    flex-direction: column
    overflow-y: scroll
  .content-block
    display: flex
    flex-direction: row
    margin-bottom: 68px
    @media(max-width: 992px)
      flex-direction: column
    .right-block
      display: flex
      flex-direction: column
      width: 300px
      align-items: flex-end
      justify-content: flex-end
    .left-block
      margin-right: 48px
      width: 333px
      display: flex
      flex-direction: column
      align-self: flex-start
      @media(max-width: 992px)
        margin-bottom: 10px
        margin-right: 0

</style>

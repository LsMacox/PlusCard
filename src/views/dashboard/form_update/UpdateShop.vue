<template>
  <v-row>
    <v-col>
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
          v-for="(item, idx) in shops"
          :key="idx"
          :marker-id="idx"
          :coords="item.coords"
          :icon="{
            layout: 'default#imageWithContent',
            imageHref: require('@/assets/svg/Bottom-tail.svg'),
            imageSize: [150, 55],
            imageOffset: [-75, -50],
            content: item.name,
            contentOffset: [0, 0],
            contentLayout: '<div class=classMarker>$[properties.iconContent]</div>',
          }"
        />
        <ymap-marker
          v-if="newShop.name && newShop.coords"
          :marker-id="shops.length"
          :coords="newShop.coords"
          :icon="{
            layout: 'default#imageWithContent',
            imageHref: require('@/assets/svg/Bottom-tail.svg'),
            imageSize: [150, 55],
            imageOffset: [-75, -50],
            content: newShop.name,
            contentOffset: [0, 0],
            contentLayout: '<div class=classMarker>$[properties.iconContent]</div>',
          }"
        />
      </yandex-map>
    </v-col>
    <v-col>
      <div style="margin: 0 68px;">
        <BaseMasterFieldBlock
          title="Точки продаж"
        >
          <span
            slot="description"
          >Если у вас несколько точек продаж - внесите их контактные данные и режимы работы, чтобы клиенты могли связаться с конкретным магазином и уточненить свои вопросы.</span>
        </BaseMasterFieldBlock>

        <div
          v-if="shops.length >= 5"
          class="content-block__search"
        >
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
        <div
          v-for="(item, index) in shops"
          :key="index"
          class="content-block__shop complete-shop"
        >
          <div class="complete-shop__header">
            <div class="header__title body-l-semibold">
              {{ item.name }}
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
                <div
                  style="display: inline-block"
                  @click="deleteShop(item)"
                >
                  <span
                    class="iconify trash_icon"
                    data-icon="feather:trash"
                    data-inline="false"
                  />
                </div>
                <div
                  style="display: inline-block"
                  @click="editShop(item)"
                >
                  <span
                    class="iconify edit_icon"
                    data-icon="feather:edit"
                    data-inline="false"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="complete-shop__content shop-content">
            <div
              v-for="(worktime, itemid) in item.workTimes"
              :key="itemid + 1000"
              class="shop-content__first"
            >
              <div class="workdays body-m-regular">
                <span
                  class="iconify"
                  data-icon="feather:calendar"
                  data-inline="false"
                />
                {{ getSelectedDays(worktime.days) }}
              </div>
              <div class="worktime body-m-regular">
                <span
                  class="iconify"
                  data-icon="feather:clock"
                  data-inline="false"
                />
                {{ worktime.startTime + '-' + worktime.endTime }}
              </div>
              <div class="breaktime body-m-regular">
                <span
                  class="iconify"
                  data-icon="feather:coffee"
                  data-inline="false"
                />
                {{ worktime.breakStart + '-' + worktime.breakEnd }}
              </div>
            </div>
            <div class="shop-content__second">
              <div class="address body-m-regular">
                <span
                  class="iconify"
                  data-icon="ion:location-outline"
                  data-inline="false"
                />
                {{ item.address }}
              </div>
            </div>
            <div class="shop-content__third">
              <div class="phone body-m-regular">
                <span
                  class="iconify"
                  data-icon="feather:phone"
                  data-inline="false"
                />
                {{ item.phone }}
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="newShopActive || newShopEdit"
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
            <v-autocomplete
              v-model="newShop.city"
              :items="filtered_cities"
              :search-input.sync="searchCity"
              hide-details
              hide-no-data
              placeholder="Выберите город"
              class="shop-card__city_select"
              style="width: 380px;"
              item-text="name"
              item-value="id"
              aria-autocomplete="none"
              autocomplete="new-street-city"
              @change="selectCity"
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
                  <span>{{ data.item.name }}</span>
                </div>
              </template>
            </v-autocomplete>
          </div>
          <div class="shop-card__input shop-card__address">
            <v-text-field
              v-if="markerGenerated"
              v-model="newShop.address"
            >
              <template slot="prepend-inner">
                <div>
                  <v-img src="@/assets/svg/location-outline.svg" />
                </div>
              </template>
            </v-text-field>
            <v-autocomplete
              v-if="!markerGenerated"
              v-model="newShop.address"
              :items="filtered_addresses"
              :search-input.sync="searchString"
              hide-details
              hide-no-data
              placeholder="Введите адрес"
              class="shop-card__city_select"
              style="width: 380px"
              item-text="name"
              item-value="pos"
              aria-autocomplete="none"
              autocomplete="new-street-address"
              @change="generate(newShop.address)"
            >
              <template slot="prepend-inner">
                <div>
                  <v-img src="@/assets/svg/location-outline.svg" />
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
                  <span>{{ data.item.name }}</span>
                </div>
              </template>
            </v-autocomplete>
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
          <div
            v-for="(worktime, globalIndex) in newShop.workTimes"
            :key="globalIndex"
            class="shop-card__work"
          >
            <div class="work-block workdays">
              <div class="workdays__title body-m-semibold">
                Рабочие дни
              </div>
              <v-select
                v-model="worktime.days"
                :items="days.filter(item => !selectedDays.includes(item.id) || worktime.days.includes(item.id))"
                item-value="id"
                placeholder="Дни"
                outlined
                multiple
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
            <div class="work-block-wrapper">
              <div class="work-block work-time">
                <div class="work-time__title body-m-semibold">
                  Рабочее время
                </div>
                <div
                  class="work-time__inputs"
                >
                  <div class="inputs__first">
                    <v-text-field
                      v-model="worktime.startTime"
                      v-mask="'##:##'"
                      placeholder="00:00"
                      outlined
                      style="width: 74px; margin-right: 4px"
                      @blur="checkLength('startTime', globalIndex)"
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
                      placeholder="00:00"
                      outlined
                      style="width: 74px;  margin: 0 16px 0 4px"
                      @blur="checkLength('endTime', globalIndex)"
                    />
                  </div>
                </div>
              </div>
              <div class="break-time">
                <div class="break-time__title body-m-semibold">
                  Перерыв
                </div>
                <div
                  class="break-time__inputs"
                >
                  <div class="inputs__first">
                    <v-text-field
                      :ref="'from'+globalIndex"
                      v-model="worktime.breakStart"
                      v-mask="'##:##'"
                      placeholder="00:00"
                      outlined
                      style="width: 74px; margin-right: 4px"
                      @blur="checkLength('breakStart', globalIndex)"
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
                      v-model="worktime.breakEnd"
                      v-mask="'##:##'"
                      placeholder="00:00"
                      outlined
                      style="width: 74px;  margin: 0 16px 0 4px"
                      @blur="checkLength('breakEnd', globalIndex)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="work-block-actions">
            <v-btn
              color="primary"
              text
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
              Добавить период
            </v-btn>
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
                @click="saveShop()"
              >
                Сохранить
              </v-btn>
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
              @click="saveShop()"
            >
              Сохранить
            </v-btn>
          </div>
        </div>
      </div>

      <div>
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
      </div>
    </v-col>
  </v-row>
</template>

<script>
  import ApiService from '@/api/api-client'
  import Color from 'color'
  import { yandexMap, ymapMarker } from 'vue-yandex-maps'
  import { mask } from 'vue-the-mask'

  export default {
    components: {
      yandexMap,
      ymapMarker,
    },
    directives: { mask },
    data () {
      return {
        markerGenerated: false,
        newShopEdit: false,
        resultAdr: '',
        addresses: [],
        cities: [],
        searchCity: '',
        searchString: '',
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
          content: 'Магазин на Чекистов 312317',
          contentOffset: [0, 0],
          contentLayout: '<div class="classMarker" style="display: flex; align-self: center; align-content: center; justify-content:center; width: 150px; height: 50px; color: #FFFFFF; font-weight: bold; text-align: center; line-height: 50px">$[properties.iconContent]</div>',
        },
        newShopActive: false,
        shop: { lat: '', lng: '' },
        shops: [],
        newShop: {
          name: '',
          city: '',
          address: '',
          phone: '',
          coords: [],
          lat: '',
          lng: '',
          workTimes: [
            {
              startTime: '',
              endTime: '',
              days: [],
              breakStart: '',
              breakEnd: '',
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
          website: '',
          social: {
            vk: '',
            youtube: '',
            fb: '',
            instagram: '',
          },
        },
        rules: {
          required: value => !!value || this.$t('required'),
          counter: value => value.length <= 20 || 'Max 20 characters',
        },
        filtered_addr: [],
      }
    },
    computed: {
      programModel () {
        return this.$store.getters['company/program/programModel']
      },
      merchant_id () {
        return JSON.parse(localStorage.getItem('vue-session-key')).merchant_id
      },
      selectedDays () {
        let array = []
        this.newShop.workTimes.forEach(item => {
          array = [...array, ...item.days]
        })
        // console.log('selectedDays', array)
        return array
      },
      filtered_addresses () {
        if (this.filtered_addr.length > 0) {
          return this.filtered_addr
        } else { return [] }
      },
      filtered_cities () {
        // //console.log('searchInput', this.searchCity)
        if (this.cities && this.cities.length && this.searchCity && this.searchCity.length > 2) {
          const array = this.cities.filter(item => (item.name.toLowerCase()).includes(this.searchCity.toLowerCase()))
          // //console.log('output array', array)
          return array
        } else { return this.cities }
      },
      sorted_work_array () {
        return this.sortById(this.newShop.workTimes)
      },

    },
    watch: {
      'worktime.endTime' (v) {
        // console.log('value', v)
      },
      searchString (v) {
        if (v && v.length > 3) {
          fetch('https://geocode-maps.yandex.ru/1.x/?apikey=e8c155ca-4721-4445-b3a0-0efb1215291b&format=json&geocode=' + encodeURIComponent(this.searchCity + ' ' + this.searchString))
            .then(resp => resp.json())
            .then(resp => {
              this.addresses = resp.response.GeoObjectCollection.featureMember
              var array = []
              let i = 0
              const regex = /[^a-zA-Zа-яА-Я0-9\s]/gm
              for (i; i < this.addresses.length; i++) {
                // console.log('item', this.addresses[i])
                array.push({
                  name: (this.addresses[i].GeoObject.name).replace(regex, ''),
                  pos: this.addresses[i].GeoObject.Point.pos,
                })
              }
              // console.log('output', array)
              this.filtered_addr = array
            })
        }

        // ApiService.get(`/api-cabinet/company/shops/search?query=${this.searchCity + ' ' + this.searchString}`).then(resp => {

        // })
      },
      'program.website' (v) {
        const regex = /^(http:\/\/|https:\/\/|)((www.|)[\w]+.[\w]+)(\/|)/gm
        const str = regex.exec(v)
        if (str && str[2] != null) {
          this.program.website = str[2]
        }
      },
      'program.social.vk' (v) {
        const regex = /^(http:\/\/|https:\/\/|)(www.|)(vk.com)/gm
        this.program.social.vk = v.replace(regex, '')
      },
      'program.social.fb' (v) {
        const regex = /^(http:\/\/|https:\/\/|)(www.|ru-ru.|www.ru-ru.|)(facebook.com|fb.com)/gm
        this.program.social.fb = v.replace(regex, '')
      },
      'program.social.youtube' (v) {
        const regex = /^(http:\/\/|https:\/\/|)(www.|)(youtube.com)/gm
        this.program.social.youtube = v.replace(regex, '')
      },
      'program.social.instagram' (v) {
        // //console.log('instagram', v)
        const regex = /^(http:\/\/|https:\/\/|)(www.|)(instagram.com)/gm
        this.program.social.instagram = v.replace(regex, '')
      },
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
    async mounted () {
      this.changeColor(this.program.bgcolor[0])
      const cities = await ApiService.get('/api-cabinet/company/shops/city/list')
      this.cities = cities
      // //console.log('cities', cities)
    },
    async created () {
      this.changeColor(this.program.bgcolor[0])
    },
    methods: {
      checkLength (label, index) {
        if (label === 'startTime') {
          if (this.newShop.workTimes[index].startTime && this.newShop.workTimes[index].startTime.length === 2) {
            this.newShop.workTimes[index].startTime += ':00'
          } else if (this.newShop.workTimes[index].startTime && this.newShop.workTimes[index].startTime.length === 1) {
            this.newShop.workTimes[index].startTime = '0' + this.newShop.workTimes[index].startTime + ':00'
          }
        }
        if (label === 'endTime') {
          if (this.newShop.workTimes[index].endTime && this.newShop.workTimes[index].endTime.length === 2) {
            this.newShop.workTimes[index].endTime += ':00'
          } else if (this.newShop.workTimes[index].endTime && this.newShop.workTimes[index].endTime.length === 1) {
            this.newShop.workTimes[index].endTime = '0' + this.newShop.workTimes[index].endTime + ':00'
          }
        }
        if (label === 'breakStart') {
          if (this.newShop.workTimes[index].breakStart && this.newShop.workTimes[index].breakStart.length === 2) {
            this.newShop.workTimes[index].breakStart += ':00'
          } else if (this.newShop.workTimes[index].breakStart && this.newShop.workTimes[index].breakStart.length === 1) {
            this.newShop.workTimes[index].breakStart = '0' + this.newShop.workTimes[index].breakStart + ':00'
          }
        }
        if (label === 'breakEnd') {
          if (this.newShop.workTimes[index].breakEnd && this.newShop.workTimes[index].breakEnd.length === 2) {
            this.newShop.workTimes[index].breakEnd += ':00'
          } else if (this.newShop.workTimes[index].breakEnd && this.newShop.workTimes[index].breakEnd.length === 1) {
            this.newShop.workTimes[index].breakEnd = '0' + this.newShop.workTimes[index].breakEnd + ':00'
          }
        }
      },
      selectCity () {
        const shop = this.cities.filter(item => item.id === this.newShop.city)[0]
        ApiService.get(`/api-cabinet/company/shops/search?query=${shop.name}`).then(resp => {
          const coords = (resp.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos).split(' ')
          this.coords = [coords[1], coords[0]]
        })
      },
      goToPrevent () {
        if (this.currentStep <= 1) {
          this.$router.push('/dashboard')
        } else this.currentStep -= 1
      },
      deleteShop (shop) {
        const index = this.shops.findIndex(item => item.name === shop.name)
        this.shops.splice(index, 1)
      },
      editShop (shop) {
        this.newShop = shop
        this.newShopEdit = true
        this.deleteShop(shop)
      },
      getSelectedDays (array) {
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
      generate (pos) {
        const item = this.addresses.find(
          item => item.GeoObject.Point.pos === pos,
        )

        const city = this.cities.find(
          item => item.id === this.newShop.city,
        )
        this.resultAdr = city.name + ', ' + item.GeoObject.name
        // console.log('generate item', item)
        const coordinates = item.GeoObject.Point.pos.split(' ')
        this.newShop.coords = [coordinates[1], coordinates[0]]
        this.coords = this.newShop.coords
      },
      saveShop () {
        // console.log('shop', this.newShop)
        this.newShop.address = this.resultAdr
        let i = 0
        let work = ''
        for (i; i < this.newShop.workTimes.length; i++) {
          // console.log('work item', this.getSelectedDays(this.newShop.workTimes[i].days))
          if (this.newShop.workTimes[i].startTime.length === 2) {
            this.newShop.workTimes[i].startTime += ':00'
          }
          if (this.newShop.workTimes[i].endTime.length === 2) {
            this.newShop.workTimes[i].endTime += ':00'
          }
          if (this.newShop.workTimes[i].breakStart.length === 2) {
            this.newShop.workTimes[i].breakStart += ':00'
          }
          if (this.newShop.workTimes[i].breakEnd.length === 2) {
            this.newShop.workTimes[i].breakEnd += ':00'
          }
          work += this.getSelectedDays(this.newShop.workTimes[i].days) + ' ' + this.newShop.workTimes[i].startTime + '-' + this.newShop.workTimes[i].endTime + '|' + this.newShop.workTimes[i].breakStart + '-' + this.newShop.workTimes[i].breakEnd + '\n'
        }
        if (this.newShopEdit) this.newShopEdit = false
        this.newShop.worktime = work
        this.newShop.workTimes = this.sortById(this.newShop.workTimes)
        this.newShop.worktime_json = JSON.stringify(this.newShop.workTimes)
        this.shops.push(this.newShop)
        this.cancelShop()
      },
      async createProgram () {
        const program = Object.assign({}, this.program)
        program.logo = this.fileLogo.data ? this.fileLogo : this.program.logo
        program.shops = this.shops
        program.merchant_id = this.merchant_id
        await ApiService.post(
          '/api-cabinet/company/create',
          program,
        )
      },
      getUnitColor () {
        if (this.program.color === '#FFFFFF') { return 'rgba(255, 255, 255, 0.5)' } else { return 'rgba(0, 0, 0, 0.5)' }
      },
      getBorderColor () {
        if (this.program.color === '#FFFFFF') { return 'rgba(255, 255, 255, 0.2)' } else { return 'rgba(0, 0, 0, 0.2)' }
      },
      arrayUnique (array) {
        const a = array.concat()
        for (let i = 0; i < a.length; ++i) {
          for (let j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j]) { a.splice(j--, 1) }
          }
        }

        return a
      },
      getSelectedWorkDays (index) {
        // //console.log('index', index)
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
        // //console.log('input array', arr)
        // arr.sort((a, b) => a.id > b.id ? 1 : -1);
        const array = []
        arr.forEach(item => {
          item.days.sort(function (a, b) {
            return a - b
          })
          array.push(item)
        })
        // //console.log('output array', array)
        return array
      },
      cancelShop () {
        if (this.newShopEdit) {
          this.shops.push(this.newShop)
          this.newShopEdit = false
        }
        this.newShopActive = false
        this.markerGenerated = false
        this.newShop = {
          name: '',
          city: '',
          address: '',
          lat: '',
          lng: '',
          phone: '',
          coords: '',
          workTimes: [
            {
              startTime: '',
              endTime: '',
              days: [],
              breakStart: '',
              breakEnd: '',
            },
          ],
        }
      },
      addShop () {
        this.markerGenerated = false
        this.newShopActive = true
      },
      async setMarker (e) {
        this.coords = e.get('coords')
        const queryCoords = this.coords[1] + ',' + this.coords[0]
        const success = await ApiService.get(
          `/api-cabinet/company/shops/search/coords?query=${queryCoords}`,
        )
        // console.log(success.response.GeoObjectCollection)
        const descr = success.response.GeoObjectCollection.featureMember[0].GeoObject
          .description
        const address =
          success.response.GeoObjectCollection.featureMember[0].GeoObject
            .name
        const city = descr.split(',')[0]
        const newCity = this.cities.filter(item => item.name === city)[0]
        // console.log('city - ' + newCity, 'address - ' + address)
        this.newShop.city = newCity.id
        this.newShop.address = address
        this.newShop.lat = this.coords[0]
        this.newShop.lng = this.coords[1]
        this.newShop.coords = this.coords
        this.markerGenerated = true
        // console.log('currentShop', this.newShop)
      },

      addWorkTime () {
        if (this.newShop.workTimes.length === 7) {
          return false
        } else {
          this.newShop.workTimes.push(
            {
              startTime: '',
              endTime: '',
              days: [],
              breakStart: '',
              breakEnd: '',
            },
          )
        }
      },
      ColorToStr (rgb, mask, alpha) {
        let red, green, blue
        red = rgb[0] + (mask - rgb[0]) * alpha
        green = rgb[1] + (mask - rgb[1]) * alpha
        blue = rgb[2] + (mask - rgb[2]) * alpha

        red = red ? this.dechex(red) : '00'
        green = green ? this.dechex(green) : '00'
        blue = blue ? this.dechex(blue) : '00'

        if (red.length === 1) red = '0' + red
        if (green.length === 1) green = '0' + green
        if (blue.length === 1) blue = '0' + blue

        return '#' + red + green + blue
      },
      dechex (number) {
        if (number < 0) {
          number = 0xFFFFFFFF + number + 1
        }
        return parseInt(number, 10)
          .toString(16)
      },
      changeColor (str) {
        const color = Color(str)
        let alpha, mask
        if (color.isLight()) {
          alpha = 0.04
          mask = 0
          this.program.bgcolor[1] = this.ColorToStr(color.rgb().array(), mask, alpha)
          this.program.color = '#2A2A34'
          // //console.log('color', this.program.bgcolor[1])
        } else {
          alpha = 0.1
          mask = 255
          this.program.bgcolor[1] = this.ColorToStr(color.rgb().array(), mask, alpha)
          this.program.color = '#FFFFFF'
          // //console.log('color', this.program.bgcolor[1])
        }
      },
      changeStep (step) {
        this.currentStep = step
      },
      async updateCompany () {
        // console.log('merchant_id', this.merchant_id)
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
      async updateShop () {
        try {
          this.loading = true
          const item = {
            id: this.program.id,
            phone: this.program.phone,
            website: this.program.website,
            socials: this.program.socials,
          }
          console.log(item)
          // await this.$store.dispatch('company/program/updateShop', item)
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'form-update.scss';
</style>

<template lang="">
  <v-container class="pa-0">
    <v-row v-if="$IsDebugMode()">
      zoom={{ zoom }} <br>
      coords={{ coords }} <br>
      shopIndex={{ shopIndex }} <br>
      filtered_shops={{ filtered_shops }}<br>
      editedShop={{ editedShop }}
    </v-row>
    <v-row>
      <v-col
        class="map-col"
        :cols="6"
        sm="12"
        md="6"
      >
        <yandex-map
          id="map2"
          :settings="$config.yandexMap"
          :zoom="zoom"
          class="map"
          :coords="coords"
          :scroll-zoom="true"
          :init-without-markers="true"
          @click="setMarker($event)"
        >
          <ymap-marker
            v-for="(item, idx) in filtered_shops"
            :key="item.id"
            :marker-id="item.id"
            :coords="[item.lat, item.lng]"
            :icon="{
              layout: 'default#imageWithContent',
              imageHref: require('@/assets/svg/Bottom-tail.svg'),
              imageSize: [150, 55],
              imageOffset: [-75, -50],
              content: getMarkerName(item.name) ,
              contentOffset: [0, 0],
              contentLayout: '<div class=classMarker>$[properties.iconContent]</div>',
            }"
            :balloon="{
              header: item.name,
              body:
                `<div>Адрес: ${item.address}</div>
                       <div>Телефон: ${item.phone}</div>`,
              footer: ''
            }"
          />
          <ymap-marker
            v-if="shopIndex === -1"
            :marker-id="editedShop.id"
            :coords="editedShop.coords"
            :icon="{
              layout: 'default#imageWithContent',
              imageHref: require('@/assets/svg/Bottom-tail.svg'),
              imageSize: [150, 55],
              imageOffset: [-75, -50],
              content: getMarkerName(editedShop.name) ,
              contentOffset: [0, 0],
              contentLayout: '<div class=classMarker>$[properties.iconContent]</div>',
            }"
            :balloon="{
              header: editedShop.name,
              body:
                `<div>Адрес: ${editedShop.address}</div>
                       <div>Телефон: ${editedShop.phone}</div>`,
              footer: ''
            }"
          />
        </yandex-map>
      </v-col>
      <v-col
        :cols="6"
        sm="12"
        md="6"
        style="padding: 0 68px;"
      >
        <div class="shop-title title-m-bold">
          Точки продаж
        </div>
        <div class="shop-description body-m-regular">
          Если у вас несколько точек продаж - внесите их контактные данные и режимы работы, чтобы клиенты могли связаться с конкретным магазином и уточненить свои вопросы.
        </div>

        <div
          v-if="programShops.length >= 5"
          class="shop-search"
        >
          <v-text-field
            v-model="shopSearch"
            placeholder="Поиск по названию, городу, улице"
            outlined
            hide-details
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

        <!--
          МАГАЗИНЫ
          -->

        <div
          v-for="(item, i) in filtered_shops"
          :key="i"
        >
          <shop-item
            :save="false"
            :item="item"
            :index="i"
            @save="confirmSaveShop"
          />
        </div>

        <!--
          МАГАЗИН ФОРМА
          -->

        <div
          v-if="shopIndex === -1"
          style="margin: 36px 0 0 0;"
        >
          <shop-form
            :save="false"
            @close="shopIndex = -2"
            @save="confirmSaveShop"
          />
        </div>

        <div
          v-else
          style="margin: 36px 0 68px 0;"
        >
          <v-btn
            color="primary"
            :text="true"
            style="padding: 0 !important;"
            @click="addShop()"
          >
            <v-icon style="margin-right: 5px;">
              $iconify_feather-plus-circle
            </v-icon>
            Добавить точку продаж
          </v-btn>
        </div>

        <v-row>
          <v-col>
            <v-btn
              :disabled="!valid"
              color="primary"
              class="master-next-btn"
              @click="onNextClick"
            >
              Далее
              <v-icon right>
                mdi-arrow-right
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import ShopItem from '@/views/dashboard/form_component/ShopItem'
  import ShopForm from '@/views/dashboard/form_component/ShopForm'
  import ApiService from '@/api/api-client'
  import { yandexMap, ymapMarker } from 'vue-yandex-maps'
  import Vue from 'vue'
  import mapConfig from '@/config/yandex-map'

  export default {
    components: {
      yandexMap,
      ymapMarker,
      ShopItem,
      ShopForm,
    },
    model: {
      prop: 'program',
      event: 'change',
    },
    props: {
      program: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        zoom: mapConfig.zoom,
        coords: mapConfig.center,
        valid: true,
        loading: false,
        openCreateForm: false,
        resultAdr: '',
        addresses: [],
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
        shop: { lat: '', lng: '' },
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
        rules: {
          required: value => !!value || this.$t('required'),
          counter: value => value.length <= 20 || 'Max 20 characters',
        },
        filtered_addr: [],
        shopSearch: null,

      }
    },

    computed: {

      programShops () {
        return this.program.shops.map(item => {
          // мапинг рабочего времени
          Vue.set(item, 'workTimes', this.getWorkTime(item.worktime_json))
          item.coords = [item.lat, item.lng]
          return item
        })
      },
      filtered_shops () {
        if (this.shopSearch) {
          const search = String(this.shopSearch).trim().toLocaleLowerCase()
          return this.programShops.filter(item =>
            (item.name && item.name.toLocaleLowerCase().indexOf(search) !== -1) ||
            (item.address && item.address.toLocaleLowerCase().indexOf(search) !== -1),
          )
        } else {
          return this.programShops
        }
      },
      shopIndex: {
        get () {
          return this.$store.getters['company/program/shopIndex']
        },
        set (v) {
          this.$store.commit('company/program/SET_SHOP_INDEX', v)
        },
      },
      editedShop: {
        get () {
          return this.$store.getters['company/program/editedShop']
        },
        set (v) {
          this.$store.commit('company/program/SET_EDITED_SHOP', v)
        },
      },
      fullAddress: {
        get () {
          return this.$store.getters['company/program/fullAddress']
        },
        set (v) {
          this.$store.commit('company/program/SET_FULL_ADDRESS', v)
        },
      },
      addressErrors: {
        get () {
          return this.$store.getters['company/program/addressErrors']
        },
        set (v) {
          this.$store.commit('company/program/SET_ADDRESS_ERRORS', v)
        },
      },

    },
    watch: {
      shopIndex (v) {
        if (v >= 0) {
          const shop = this.filtered_shops.find((item, i) => i === v)
          if (shop) {
            this.coords = [shop.lat, shop.lng]
          }
        }
      },
    },
    created () {
      // сброс store
      this.$store.dispatch('company/program/ResetShopState')
    },
    destroyed () {
      // сброс store
      this.$store.dispatch('company/program/ResetShopState')
    },
    methods: {
      getWorkTime (workObj) {
        const days = {
          mondey: 0,
          tuesday: 1,
          wednesday: 2,
          thursday: 3,
          friday: 4,
          saturday: 5,
          sunday: 6,
        }

        const wtNew = []

        for (const key in workObj) {
          // заполнение первого элемента
          if (!wtNew.length) {
            if (workObj[key].isWorkDay) {
              wtNew.push({
                days: [days[key]],
                startTime: workObj[key].start,
                endTime: workObj[key].finish,
                breakStart: workObj[key].pause_start,
                breakEnd: workObj[key].pause_finish,
              })
            }
          } else {
            wtNew.forEach(period => {
              if (workObj[key].isWorkDay &&
                period.startTime === workObj[key].start &&
                period.endTime === workObj[key].finish &&
                period.breakStart === workObj[key].pause_start &&
                period.breakEnd === workObj[key].pause_finish) {
                if (Array.isArray(period.days)) {
                  period.days.push(days[key])
                } else {
                  period.days = []
                  period.days.push(days[key])
                }
              } else {
                if (workObj[key].isWorkDay) {
                  wtNew.push({
                    days: [days[key]],
                    startTime: workObj[key].start,
                    endTime: workObj[key].finish,
                    breakStart: workObj[key].pause_start,
                    breakEnd: workObj[key].pause_finish,
                  })
                }
              }
            })
          }
        }

        return wtNew
      },
      confirmSaveShop (shop) {
        const index = this.program.shops.findIndex(x => x.id === shop.id)
        console.log('confirmSaveShop', shop, index)
        if (index >= 0) {
          Vue.set(this.program.shops, index, shop)
        } else {
          this.program.shops.push(shop)
        }
      },
      getMarkerName (str) {
        if (!str) return ''
        const maxLen = 16
        const strTrim = str.trim()
        return strTrim.length > maxLen ? strTrim.substring(0, maxLen) + '...' : strTrim
      },
      async setMarker (e) {
        // не делаем запрос если
        // не открыта карточка торговой точки
        if (this.shopIndex !== -2) {
          this.coords = e.get('coords')
          const queryCoords = this.coords[1] + ',' + this.coords[0]
          const success = await ApiService.get(
            `/api-cabinet/company/shops/search/coords?query=${queryCoords}`,
          )
          console.log('search/coords', success)
          // массив геообъектов
          const featureMembers = success.response.GeoObjectCollection.featureMember

          if (featureMembers.length) {
            const featureMember = featureMembers[0]
            const kind = featureMember.GeoObject.metaDataProperty.GeocoderMetaData.kind
            const address = featureMember.GeoObject.metaDataProperty.GeocoderMetaData.text
            let city = null
            if (kind === 'house') {
              city = featureMember.GeoObject.metaDataProperty.GeocoderMetaData.Address.Components.find(item => item.kind === 'locality')
              this.fullAddress = true
              this.addressErrors = []
            } else {
              this.fullAddress = false
              this.addressErrors = ['Введите полный адрес']
            }
            console.log(address)
            console.log(city)

            this.editedShop.city_id = city ? city.name : null
            this.editedShop.address = address
            this.editedShop.lat = this.coords[0]
            this.editedShop.lng = this.coords[1]
            this.editedShop.coords = this.coords

            // обновление координат при редактировании магазина
            if (this.shopIndex >= 0) {
              this.filtered_shops.forEach((item, i) => {
                if (i === this.shopIndex) {
                  item.lat = this.coords[0]
                  item.lng = this.coords[1]
                }
              })
            }
          }
        }
      },
      addShop () {
        console.log('addShop')
        this.$store.dispatch('company/program/GenNewShop').then(newShop => {
          console.log('GenNewShop', newShop)
          this.editedShop = newShop
          this.shopIndex = -1
        })
      },
      onNextClick () {
        this.$emit('continue', true)
      },
    },
  }
</script>

<style lang="scss">
.classMarker {
  display: flex;
  align-self: center;
  align-content: center;
  justify-content: center;
  width: 150px;
  height: 50px;
  color: #FFFFFF;
  font-weight: bold;
  text-align: center;
  line-height: 50px;

  .ymapMarker {
    width: 150px;
    height: 50px;
    background: #4776E6;
    border-radius: 8px;
    opacity: .3;
  }
}
</style>
<style lang="scss" scoped>
@import "master-style.scss";
@import '@/views/dashboard/form_update/_form-update.scss';
@import '@/styles/variables.scss';

.map-col {
margin-left: -$page-content-padding-size;
}

</style>

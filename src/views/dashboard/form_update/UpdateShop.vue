<template>
  <div>
    <top-menu
      :menu="menu"
      :value="1"
      cancel-button-text="Отменить"
      action-button-text="Сохранить"
      :loading="loading"
      @cancelbutton="toRoute('/dashboard')"
      @actionbutton=""
    />
    <v-row>
      <v-col>
        <div style="position: relative; height: 100%;">
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
              :coords="[item.lat, item.lng]"
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
              v-if="shopIndex === -1"
              :marker-id="shops.length"
              :coords="editedShop.coords"
              :icon="{
                layout: 'default#imageWithContent',
                imageHref: require('@/assets/svg/Bottom-tail.svg'),
                imageSize: [150, 55],
                imageOffset: [-75, -50],
                content: editedShop.name,
                contentOffset: [0, 0],
                contentLayout: '<div class=classMarker>$[properties.iconContent]</div>',
              }"
            />
          </yandex-map>
        </div>
      </v-col>
      <v-col>
        <div style="margin: 0 68px;">
          <div class="shop-title title-m-bold">
            Точки продаж
          </div>
          <div class="shop-description body-m-regular">
            Если у вас несколько точек продаж - внесите их контактные данные и режимы работы, чтобы клиенты могли связаться с конкретным магазином и уточненить свои вопросы.
          </div>

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

          <!--
          МАГАЗИНЫ
          -->

          <div
            v-for="(item, i) in shops"
            :key="i"
          >
            <shop-item
              :item="item"
              :index="i"
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
              @close="shopIndex = -2"
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
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import ShopItem from '@/views/dashboard/form_component/ShopItem'
  import ShopForm from '@/views/dashboard/form_component/ShopForm'
  import ApiService from '@/api/api-client'
  import { yandexMap, ymapMarker } from 'vue-yandex-maps'
  import { mask } from 'vue-the-mask'
  import TopMenu from '@/components/base/TopMenu'
  import Routing from '@/mixins/routing'

  export default {
    components: {
      yandexMap,
      ymapMarker,
      TopMenu,
      ShopItem,
      ShopForm,
    },
    directives: { mask },
    mixins: [Routing],
    data () {
      return {
        settings: {
          apiKey: 'e994d83e-a10e-47e4-bb45-94038d17ba64',
          lang: 'ru_RU',
          coordorder: 'latlong',
          version: '2.1',
        },
        zoom: 16,
        //
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
      }
    },
    computed: {
      menu () {
        return this.$store.getters['company/program/menu']
      },
      programModel () {
        return this.$store.getters['company/program/programModel']
      },
      shops () {
        const shops = this.$store.getters['company/program/shops']
        // мапинг рабочего времени
        shops.forEach(item => {
          item.workTimes = this.getWorkTime(item.worktime_json)
          item.coords = [item.lat, item.lng]
        })
        return shops
      },
      merchant_id () {
        return JSON.parse(localStorage.getItem('vue-session-key')).merchant_id
      },
      editedShop: {
        get () {
          return this.$store.getters['company/program/editedShop']
        },
        set (v) {
          this.$store.commit('company/program/SET_EDITED_SHOP', v)
        },
      },
      shopIndex: {
        get () {
          return this.$store.getters['company/program/shopIndex']
        },
        set (v) {
          this.$store.commit('company/program/SET_SHOP_INDEX', v)
        },
      },
      coords: {
        get () {
          return this.$store.getters['company/program/mapCenter']
        },
        set (v) {
          this.$store.commit('company/program/SET_MAP_CENTER', v)
        },
      },
    },
    watch: {
      shopIndex (v) {
        if (v >= 0) {
          const shop = this.shops.find((item, i) => i === v)
          if (shop) {
            this.coords = [shop.lat, shop.lng]
          }
        }
      },
    },
    created () {
      // центрируемся на первой торговой точке
      if (this.shops.length) this.coords = [this.shops[0].lat, this.shops[0].lng]
    },
    methods: {
      async setMarker (e) {
        // не делаем запрос если
        // не открыта карточка торговой точки
        if (this.shopIndex !== -2) {
          this.coords = e.get('coords')
          const queryCoords = this.coords[1] + ',' + this.coords[0]
          const success = await ApiService.get(
            `/api-cabinet/company/shops/search/coords?query=${queryCoords}`,
          )
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
              this.shops.forEach((item, i) => {
                if (i === this.shopIndex) {
                  item.lat = this.coords[0]
                  item.lng = this.coords[1]
                }
              })
            }
          }
        }
      },
      goToPrevent () {
        if (this.currentStep <= 1) {
          this.$router.push('/dashboard')
        } else this.currentStep -= 1
      },
      updateShop (shop) {
        this.newShop = shop
        this.newShopEdit = true
        // this.deleteShop(shop)
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
      addShop () {
        const shop = JSON.parse(JSON.stringify(this.$store.getters['company/program/defaultShop']))
        this.editedShop = shop
        this.shopIndex = -1
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
@import 'form-update.scss';
</style>

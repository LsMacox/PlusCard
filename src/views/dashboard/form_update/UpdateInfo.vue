<template>
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      <v-form
        ref="form"
        v-model="valid"
        style="max-width: 676px;"
      >
        <BaseMasterFieldBlock
          title="Название"
          :horisontal="true"
        >
          <span
            slot="description"
          >Юридическое название компании без кавычек и формы собственности. Есть фирменное название? Отлично! Вводите его.</span>
          <template v-slot:input>
            <base-text-field
              v-model="program.name"
              :validate-on-blur="true"
              :rules="nameRules"
              placeholder="Название компании"
              outlined
              counter
              minlength="1"
              maxlength="20"
            />
          </template>
        </BaseMasterFieldBlock>

        <BaseMasterFieldBlock
          title="Карта клиента"
          :horisontal="true"
        >
          <span
            slot="description"
          >Вот так будет выглядеть ваша карта в приложении. Измените цвет карты кликнув на ней и загрузите логотип, кликнув по иконке.</span>
          <template v-slot:input>
            <company-card
              :program="program"
            />
          </template>
        </BaseMasterFieldBlock>
      </v-form>
    </v-row>

    <div class="content-blocks-wrapper">
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
</template>

<script>
  import ApiService from '@/api/api-client'
  import Color from 'color'
  import CompanyCard from '@/components/dialogs/CompanyCard'

  export default {
    components: {
      CompanyCard,
    },
    data () {
      return {
        valid: false,
        nameRules: [(value) => !!value || 'Введите название'],
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
        rules: {
          required: value => !!value || this.$t('required'),
          counter: value => value.length <= 20 || 'Max 20 characters',
        },
        filtered_addr: [],
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/programModel']
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
    created () {
      console.log(this.program)
      this.changeColor(this.program.bgcolor1)
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
          this.program.bgcolor2 = this.ColorToStr(color.rgb().array(), mask, alpha)
          this.program.color = '#2A2A34'
          // //console.log('color', this.program.bgcolor2)
        } else {
          alpha = 0.1
          mask = 255
          this.program.bgcolor2 = this.ColorToStr(color.rgb().array(), mask, alpha)
          this.program.color = '#FFFFFF'
          // //console.log('color', this.program.bgcolor2)
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
    },
  }
</script>

<style lang="scss" scoped>
@import 'form-update.scss';
</style>

<template>
  <v-form
    v-model="valid"
    class="shop-form"
    style="margin: 36px 0; padding-top: 24px;"
  >
    <v-text-field
      v-model="editedShop.name"
      placeholder="Введите название точки"
      outlined
      maxlength="250"
      :rules="[
        v => !!v || 'Название точки продаж обязательно',
        v => String(v).length <= 250 || 'Название должно быть не более 250 символов',
      ]"
      style="width: 380px"
    >
      <template slot="prepend-inner">
        <v-icon color="neutral-500">
          $iconify_bx-bx-building-house
        </v-icon>
      </template>
    </v-text-field>
    <v-text-field
      v-model="editedShop.address"
      placeholder="Город, улица, дом"
      outlined
      style="width: 100%; max-width: 380px"
      maxlength="250"
      :error-messages="addressErrors"
      :rules="[
        v => !!v || 'Адрес точки продаж обязателен',
        v => String(v).length <= 250 || 'Адрес должен быть не более 250 символов',
      ]"
      @input="getAddressHandler"
      @blur="(e) => getAddressHandler(editedShop.address)"
    >
      <template slot="prepend-inner">
        <div>
          <v-img src="@/assets/svg/location-outline.svg" />
        </div>
      </template>
    </v-text-field>

    <div>
      <v-text-field
        v-model="editedShop.phone"
        placeholder="Введите телефон"
        outlined
        style="width: 380px"
        maxlength="100"
        :rules="[
          v => !!v || 'Телефон точки продаж обязателен',
          v => v.length <= 100 || 'Телефон должен быть не более 100 символов',
        ]"
      >
        <template slot="prepend-inner">
          <div>
            <v-img src="@/assets/svg/phone.svg" />
          </div>
        </template>
      </v-text-field>
    </div>

    <!--
      РАБОЧЕЕ ВРЕМЯ
      -->

    <div
      v-for="(worktime, globalIndex) in editedShop.workTimes"
      :key="globalIndex"
    >
      <div class="shop-form-control">
        <div
          class="shop-form-label"
          style="display: flex; align-items: center;"
        >
          <div class="body-m-semibold">
            Рабочие дни
          </div>
          <div class="app__spacer" />
          <div>
            <v-btn
              v-if="editedShop.workTimes.length > 1 && globalIndex !== 0"
              color="#EA4C2A"
              text
              :ripple="false"
              @click="removeWorkTime(globalIndex)"
            >
              <v-icon
                width="18px"
                heigth="18px"
                style="margin-right: 5px;"
              >
                $iconify_feather-trash
              </v-icon>
              удалить
            </v-btn>
          </div>
        </div>
        <v-select
          v-model="worktime.days"
          :items="days.filter(item => !selectedDays.includes(item.id) || worktime.days.includes(item.id))"
          item-value="id"
          placeholder="Выберите рабочие дни"
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
      <div class="shop-form-work-time">
        <div class="shop-form-work-time-control">
          <div class="shop-form-control">
            <div class="shop-form-label body-m-semibold">
              Рабочее время
            </div>
            <div class="shop-form-period">
              <div class="shop-form-period-control">
                <v-text-field
                  v-model="worktime.startTime"
                  v-mask="'##:##'"
                  placeholder="С"
                  outlined
                  hide-details
                  @blur="checkLength('startTime', globalIndex)"
                />
              </div>
              <div
                class="shop-form-period-separator"
              >
                -
              </div>
              <div class="shop-form-period-control">
                <v-text-field
                  v-model="worktime.endTime"
                  v-mask="'##:##'"
                  placeholder="По"
                  outlined
                  hide-details
                  @blur="checkLength('endTime', globalIndex)"
                />
              </div>
            </div>
            <v-row>
              <v-col>
                <base-ext-switch
                  :input-value="isFullWorkDay(worktime)"
                  label="Круглосуточно"
                  class="mt-0"
                  @change="changeFullWorkDay(worktime, $event)"
                />
              </v-col>
            </v-row>
          </div>
        </div>
        <div
          class="shop-form-work-time-control"
          style="padding-left: 10px;"
        >
          <div class="shop-form-control">
            <div class="shop-form-label body-m-semibold">
              Перерыв
            </div>
            <div class="shop-form-period">
              <div class="shop-form-period-control">
                <v-text-field
                  :ref="'from'+globalIndex"
                  v-model="worktime.breakStart"
                  v-mask="'##:##'"
                  placeholder="С"
                  outlined
                  @blur="checkLength('breakStart', globalIndex)"
                />
              </div>
              <div
                class="shop-form-period-separator"
              >
                -
              </div>
              <div class="shop-form-period-control">
                <v-text-field
                  v-model="worktime.breakEnd"
                  v-mask="'##:##'"
                  placeholder="По"
                  outlined
                  @blur="checkLength('breakEnd', globalIndex)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="shop-form-period-action">
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
        Еще рабочее время
      </v-btn>
    </div>
    <div class="shop-form-action">
      <div style="width: 28%;">
        <v-btn
          :ripple="false"
          :text="true"
          color="info"
          style="width:85px; height: 41px; text-transform: none; font-weight: 600;
                  font-size: 13px;
                  line-height: 17px;"
          @click="cancel()"
        >
          <v-img
            src="@/assets/svg/close-circle_grey.svg"
            style="margin-right: 6px"
          />
          Отменить
        </v-btn>
      </div>
      <div style="width: 72%;">
        <v-btn
          color="secondary"
          small
          style="width: 265px; margin-right: 0"
          :loading="loading"
          :disabled="!valid || !fullAddress"
          @click="saveShop()"
        >
          Сохранить
        </v-btn>
      </div>
    </div>
  </v-form>
</template>

<script>
  import ApiService from '@/api/api-client'
  import { mask } from 'vue-the-mask'

  export default {
    directives: { mask },
    props: {
      save: {
        type: Boolean,
        default: true,
      },
    },
    data () {
      return {
        valid: true,
        loading: false,
        editedShopActive: false,
        editedShopEdit: false,
        getAddressTimerId: null,
        actionsShow: false,
        openUpdate: false,
        newWorkTime: [],
        newBreakTime: [],
        days: [
          { id: 0, shortName: 'ПН', fullName: 'Понедельник' },
          { id: 1, shortName: 'ВТ', fullName: 'Вторник' },
          { id: 2, shortName: 'СР', fullName: 'Среда' },
          { id: 3, shortName: 'ЧТ', fullName: 'Четверг' },
          { id: 4, shortName: 'ПТ', fullName: 'Пятница' },
          { id: 5, shortName: 'СБ', fullName: 'Суббота' },
          { id: 6, shortName: 'ВС', fullName: 'Воскресенье' },
        ],
        copyModel: {},
      }
    },
    computed: {
      programModel () {
        return this.$store.getters['company/program/programModel']
      },
      shops () {
        return this.$store.getters['company/program/shops']
      },
      editedShop: {
        get () {
          return this.$store.getters['company/program/editedShop']
        },
        set (v) {
          this.$store.commit('company/program/SET_EDITED_SHOP', v)
        },
      },
      shopIndex () {
        return this.$store.getters['company/program/shopIndex']
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
      selectedDays () {
        const array = []
        /*
        this.editedShop.workTimes.forEach(item => {
          array = [...array, ...item.days]
        })
        */
        // console.log('selectedDays', array)
        return array
      },
      sorted_work_array () {
        return this.sortById(this.editedShop.workTimes)
      },
    },
    created () {
      // обновление state
      this.fullAddress = this.editedShop && !!this.editedShop.city_id
      this.addressErrors = []
      // есть id города
      // if (typeof this.editedShop.city_id === 'number') this.fullAddress = true

      console.log(this.editedShop)
      // копия редактируемой модели
      this.copyModel = JSON.parse(JSON.stringify(this.editedShop))
    },
    methods: {
      changeFullWorkDay (worktime, v) {
        if (v) {
          worktime.startTime = worktime.endTime = null
        } else if (!worktime.startTime && !worktime.endTime) {
          worktime.startTime = '09:00'
          worktime.endTime = '18:00'
        }
      },
      isFullWorkDay (worktime) {
        return worktime && !worktime.endTime && !worktime.startTime
      },
      cancel () {
        // сброс модели при отмене редактирования
        this.shops.forEach((item, i) => {
          if (i === this.shopIndex) {
            this.shops[i] = JSON.parse(JSON.stringify(this.copyModel))
          }
        })
        this.close()
      },
      close () {
        this.editedShop = {
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
        }
        this.$emit('close')
      },
      /*
       * геолокация
       */
      getAddressHandler (v) {
        console.log('getAddressHandler')
        if (this.getAddressTimerId) clearTimeout(this.getAddressTimerId)
        this.getAddressTimerId = null
        const timeout = 1500
        this.getAddressTimerId = setTimeout(this.getAddress, timeout, v)
      },
      async getAddress (v) {
        // поиск с 10 символа
        if (v && v.length > 10) {
          const success = await ApiService.get(
            `/api-cabinet/company/shops/search?query=${v}`,
          )
          console.log('GEO search string:', v)

          // массив геообъектов
          const featureMembers = success.response.GeoObjectCollection.featureMember

          console.log(featureMembers)

          if (featureMembers.length) {
            const featureMember = featureMembers[0]
            const kind = featureMember.GeoObject.metaDataProperty.GeocoderMetaData.kind
            let pos = featureMember.GeoObject.Point.pos
            const address = featureMember.GeoObject.metaDataProperty.GeocoderMetaData.text
            let city = null
            console.log(kind, pos, address)
            if (kind === 'house') {
              city = featureMember.GeoObject.metaDataProperty.GeocoderMetaData.Address.Components.find(item => item.kind === 'locality')
              this.fullAddress = true
              this.addressErrors = []
            } else {
              this.fullAddress = false
              this.addressErrors = ['Укажите полный адрес']
            }
            if (pos) {
              pos = pos.split(' ')
              const coords = [pos[1], pos[0]]

              this.$store.commit('company/program/SET_MAP_CENTER', coords)
              if (this.fullAddress) {
                this.editedShop.lat = coords[0]
                this.editedShop.lng = coords[1]
                this.editedShop.coords = coords
                this.editedShop.address = address
                // обновление координат при редактировании магазина
                this.shops.forEach((item, i) => {
                  if (i === this.shopIndex) {
                    item.lat = this.editedShop.lat
                    item.lng = this.editedShop.lng
                  }
                })
              }
            }
            console.log(address)
            console.log(city)

            this.editedShop.city_id = city ? city.name : null
            // this.editedShop.address = address
          }
        }
      },
      /*
       * рабочее время
       */
      addWorkTime () {
        if (this.editedShop.workTimes.length === 7) {
          return false
        } else {
          this.editedShop.workTimes.push(
            {
              startTime: null,
              endTime: null,
              days: [],
              breakStart: '',
              breakEnd: '',
            },
          )
        }
      },
      removeWorkTime (i) {
        if (this.editedShop.workTimes.length > 1) this.editedShop.workTimes.splice(i, 1)
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
      checkLength (label, index) {
        let timeStr = this.editedShop.workTimes[index][label]
        if (timeStr) {
          timeStr = String(timeStr)
          if (timeStr.length === 1) {
            timeStr = `0${timeStr}:00`
          }
          if (timeStr.length === 2) {
            timeStr = `${timeStr}:00`
          }
          if (timeStr.length === 4) {
            const time = timeStr.split(':')
            if (time.length === 2) {
              if (time[1].length === 1) time[1] = `0${time[1]}`
              timeStr = `${time[0]}:${time[1]}`
            }
          }
          if (timeStr.length === 5) {
            const time = timeStr.split(':')
            if (time.length === 2) {
              if (Number(time[0]) > 23) time[0] = '23'
              if (Number(time[1]) > 59) time[1] = '59'
              timeStr = `${time[0]}:${time[1]}`
            }
          }
        }
        this.editedShop.workTimes[index][label] = timeStr
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
      setWorkTime (workJson) {
        //
        const wt = JSON.parse(workJson)
        const wtNew = {}

        // определение рабочих дней
        wt.forEach(period => {
          period.days.forEach(day => {
            switch (day) {
              case 0:
                wtNew.mondey = {
                  type: 'MONDEY',
                  start: period.startTime,
                  finish: period.endTime,
                  isWorkDay: true,
                  pause_start: period.breakStart,
                  pause_finish: period.breakEnd,
                }
                break

              case 1:
                wtNew.tuesday = {
                  type: 'TUESDAY',
                  start: period.startTime,
                  finish: period.endTime,
                  isWorkDay: true,
                  pause_start: period.breakStart,
                  pause_finish: period.breakEnd,
                }
                break

              case 2:
                wtNew.wednesday = {
                  type: 'WEDNESDAY',
                  start: period.startTime,
                  finish: period.endTime,
                  isWorkDay: true,
                  pause_start: period.breakStart,
                  pause_finish: period.breakEnd,
                }
                break

              case 3:
                wtNew.thursday = {
                  type: 'THURSDAY',
                  start: period.startTime,
                  finish: period.endTime,
                  isWorkDay: true,
                  pause_start: period.breakStart,
                  pause_finish: period.breakEnd,
                }
                break

              case 4:
                wtNew.friday = {
                  type: 'FRIDAY',
                  start: period.startTime,
                  finish: period.endTime,
                  isWorkDay: true,
                  pause_start: period.breakStart,
                  pause_finish: period.breakEnd,
                }
                break

              case 5:
                wtNew.saturday = {
                  type: 'SATURDAY',
                  start: period.startTime,
                  finish: period.endTime,
                  isWorkDay: true,
                  pause_start: period.breakStart,
                  pause_finish: period.breakEnd,
                }
                break

              case 6:
                wtNew.sunday = {
                  type: 'SUNDAY',
                  start: period.startTime,
                  finish: period.endTime,
                  isWorkDay: true,
                  pause_start: period.breakStart,
                  pause_finish: period.breakEnd,
                }
                break
            }
          })
        })

        // определение нерабочих дней
        const days = ['mondey', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
        days.forEach(day => {
          if (!Object.keys(wtNew).includes(day)) {
            wtNew[day] = {
              type: day.toUpperCase(),
              start: null,
              finish: null,
              isWorkDay: false,
              pause_start: null,
              pause_finish: null,
            }
          }
        })

        return wtNew
      },
      async saveShop () {
        let work = ''
        for (let i = 0; i < this.editedShop.workTimes.length; i++) {
          // console.log('work item', this.getSelectedDays(this.editedShop.workTimes[i].days))
          if (this.editedShop.workTimes[i].startTime && this.editedShop.workTimes[i].startTime.length === 2) {
            this.editedShop.workTimes[i].startTime += ':00'
          }
          if (this.editedShop.workTimes[i].endTime && this.editedShop.workTimes[i].endTime.length === 2) {
            this.editedShop.workTimes[i].endTime += ':00'
          }
          if (this.editedShop.workTimes[i].breakStart && this.editedShop.workTimes[i].breakStart.length === 2) {
            this.editedShop.workTimes[i].breakStart += ':00'
          }
          if (this.editedShop.workTimes[i].breakEnd && this.editedShop.workTimes[i].breakEnd.length === 2) {
            this.editedShop.workTimes[i].breakEnd += ':00'
          }
          work += this.getSelectedDays(this.editedShop.workTimes[i].days) + ' ' + this.editedShop.workTimes[i].startTime + '-' + this.editedShop.workTimes[i].endTime + '|' + this.editedShop.workTimes[i].breakStart + '-' + this.editedShop.workTimes[i].breakEnd + '\n'
        }
        if (this.editedShopEdit) this.editedShopEdit = false
        this.editedShop.worktime = work
        this.editedShop.workTimes = this.sortById(this.editedShop.workTimes)
        this.editedShop.worktime_json = JSON.stringify(this.editedShop.workTimes)

        /*
        this.shops.push(this.editedShop)
        console.log('this.shops.push(this.editedShop)')
        console.log(this.shops)
        */

        console.log(this.editedShop)

        try {
          this.loading = true
          const item = {
            id: this.editedShop.id,
            isNew: this.editedShop.isNew,
            program_id: this.programModel.id,
            name: this.editedShop.name,
            city_id: this.editedShop.city_id,
            address: this.editedShop.address,
            phone: this.editedShop.phone,
            worktime_json: this.setWorkTime(this.editedShop.worktime_json),
            lat: String(Number(this.editedShop.coords[0]).toFixed(6)),
            lng: String(Number(this.editedShop.coords[1]).toFixed(6)),
          }
          console.log(item)
          if (this.save) {
            if (this.editedShop && this.editedShop.id && !this.editedShop.isNew) await this.$store.dispatch('company/program/updateShop', item)
            else await this.$store.dispatch('company/program/createShop', item)
          } else {
            this.$emit('save', item)
          }

          this.close()
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'form-component.scss';
</style>

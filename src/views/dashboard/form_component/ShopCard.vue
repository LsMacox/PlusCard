<template>
  <div class="shop-card">
    <div class="shop-card-header">
      <div class="shop-card-title body-l-semibold">
        {{ item.name }}
      </div>
      <div
        class="shop-card-title-action"
        @mouseleave="actionsShow = false"
      >
        <div
          v-show="!actionsShow"
          @mouseover="actionsShow = true"
        >
          <v-icon style="color: #B5B5C4; position: relative; top: 3px;">
            $iconify_feather-more-vertical
          </v-icon>
        </div>
        <div
          v-show="actionsShow"
          class="shop-card-title-action-items"
          @mouseleave="actionsShow = false"
        >
          <v-icon
            class="icon-red"
            style="margin-right: 18px;"
            :loading="loading"
            @click="deleteShop(item)"
          >
            $iconify_feather-trash
          </v-icon>
          <v-icon
            class="icon-blue"
            @click="updateShop()"
          >
            $iconify_feather-edit
          </v-icon>
        </div>
      </div>
    </div>
    <div
      v-for="(worktime, itemid) in item.workTimes"
      :key="itemid + 1000"
      class="shop-card-work-time"
    >
      <div class="shop-card-work-time-item body-m-regular">
        <v-icon class="shop-card-work-time-icon">
          $iconify_feather-calendar
        </v-icon>
        <div style="width: 65px;">
          {{ getSelectedDays(worktime.days) }}
        </div>
      </div>
      <div class="shop-card-work-time-item body-m-regular">
        <v-icon class="shop-card-work-time-icon">
          $iconify_feather-clock
        </v-icon>
        <div style="width: 100px;">
          {{ worktime.startTime + '-' + worktime.endTime }}
        </div>
      </div>
      <div class="shop-card-work-time-item body-m-regular">
        <v-icon class="shop-card-work-time-icon">
          $iconify_feather-coffee
        </v-icon>
        <div style="width: 100px;">
          {{ (worktime.breakStart && worktime.breakEnd) ? worktime.breakStart + '-' + worktime.breakEnd : 'без перерыва' }}
        </div>
      </div>
    </div>
    <div class="shop-card-address">
      <v-icon class="shop-card-address-icon">
        $iconify_ion-location-outline
      </v-icon>
      <div class="body-m-regular">
        {{ item.address }}
      </div>
    </div>
    <div class="shop-card-address">
      <v-icon class="shop-card-address-icon">
        $iconify_feather-phone
      </v-icon>
      <div class="body-m-regular">
        {{ item.phone }}
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        default: {},
      },
    },
    data () {
      return {
        loading: false,
        actionsShow: false,
        days: [
          { id: 0, shortName: 'ПН', fullName: 'Понедельник' },
          { id: 1, shortName: 'ВТ', fullName: 'Вторник' },
          { id: 2, shortName: 'СР', fullName: 'Среда' },
          { id: 3, shortName: 'ЧТ', fullName: 'Четверг' },
          { id: 4, shortName: 'ПТ', fullName: 'Пятница' },
          { id: 5, shortName: 'СБ', fullName: 'Суббота' },
          { id: 6, shortName: 'ВС', fullName: 'Воскресенье' },
        ],
      }
    },
    methods: {
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
      async deleteShop (item) {
        try {
          this.loading = true
          await this.$store.dispatch('company/program/deleteShop', item)
        } finally {
          this.loading = false
        }
      },
      updateShop () {
        this.$emit('open')
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'form-component.scss';
</style>

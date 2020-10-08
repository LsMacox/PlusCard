<template>
  <div class="bonus-accounts">
    <div class="bonus-accounts__header">
      <p class="body-l-semibold">
        Бонусные счета
      </p>
    </div>
    <div class="bonus-accounts__cards">
      <div
        v-for="category in categories"
        :key="category.title"
        class="bonus-accounts__card"
      >
        <div class="card__header">
          <p class="card__header-title body-l-semibold">
            {{ category.title }}
          </p>
          <p class="card__header-count title-m-bold success--text">
            <span>{{ category.count | spacesBetweenNumbers }}</span>
            <span
              v-if="category.of != undefined"
              class="neutral-400--text"
            >/{{ category.of }}</span>
          </p>
          <div class="card__header-control">
            <v-btn
              class="control-btn"
              color="primary-100"
              @click="!category.menuShow ? menuOperation(category, 'writeOff') : menuClose(category.id)"
            >
              <iconify-icon
                :icon="!category.menuShow ? 'feather-minus' : 'jam-close'"
                width="15"
              />
            </v-btn>
            <v-btn
              class="control-btn"
              :class="{active: category.menuShow}"
              color="primary-100"
              @click="!category.menuShow ? menuOperation(category, 'charge') : menuSave(category)"
            >
              <iconify-icon
                :icon="!category.menuShow ? 'eva-plus-outline' : 'octicon-check-16'"
                width="15"
              />
            </v-btn>
          </div>
        </div>
        <div
          v-if="category.menuShow"
          class="card__body"
        >
          <div class="card__body-form">
            <base-select
              v-if="category.mode == 'charge'"
              v-model="chargeData.selectedItem"
              class="card__body-select"
              :items="chargeData.listItems"
            />
            <div class="card__body-group">
              <v-text-field
                v-model="generalData.sum"
                v-mask="getMask(category.mode)"
                class="panel-crm__form-input card__body-input"
                type="text"
                :placeholder="category.mode == 'writeOff' ? 'Списать:' : 'Начислить:'"
                outlined
                hide-details
              />
              <v-text-field
                v-if="category.mode == 'charge'"
                v-model="chargeData.acts"
                v-mask="'Действуют: ###'"
                class="panel-crm__form-input card__body-input"
                type="text"
                placeholder="Дейсвуют (дней)"
                outlined
                hide-details
              />
            </div>
            <div
              class="panel-crm__form-textarea"
              style="margin-bottom: 20px"
            >
              <v-textarea
                v-model="generalData.description"
                class="panel-crm__form-input card__body-input"
                rows="4"
                placeholder="Введите комментарий (необязательно)"
                outlined
                auto-grow
                hide-details
              />
              <div class="textarea---angle" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="success.active"
      class="bonus-accounts__success"
      :class="success.mode ? 'success--text' : 'error--text'"
    >
      <iconify-icon
        class="icon-success"
        :icon="success.mode ? 'octicon-check-circle-fill' : 'jam-close-fill'"
        width="21"
      />
      <p class="body-s-semibold">
        {{ success.mode ? 'Начислено ' : 'Списано ' }}{{ Number(success.data) }} бонусных рублей
      </p>
    </div>
  </div>
</template>

<script>
  import BaseSelect from '@/components/base/BaseSelect'
  import { mask } from 'vue-the-mask'

  export default {
    directives: { mask },
    components: { BaseSelect },
    data () {
      return {
        generalData: this.getDefaultGeneralData(),
        chargeData: this.getDefaultChartData(),
        success: {
          active: false,
          mode: true,
          data: null,
        },
        categories: [
          {
            id: 1,
            title: 'Бонусные рубли',
            count: 1364,
            menuShow: false,
            mode: 'writeOff', // charge
          },
          {
            id: 2,
            title: 'Бонусы',
            count: 1993,
            menuShow: false,
            mode: 'writeOff', // charge
          },
          {
            id: 3,
            title: 'Чашки кофе',
            count: 4,
            of: 10,
            menuShow: false,
            mode: 'writeOff', // charge
          },
        ],
      }
    },
    watch: {},
    methods: {
      getMask (mode) {
        return mode === 'writeOff' ? 'Списать: ###########' : 'Начислить: ###########'
      },
      getCategoryIndexById (id) {
        return this.$_.findIndex(this.categories, (category) => { return category.id === id })
      },
      menuOperation (category, mode) {
        const categoryIndex = this.getCategoryIndexById(category.id)

        this.categories[categoryIndex].mode = mode
        this.categories[categoryIndex].menuShow = true
      },
      menuClose (id) {
        this.clearData()
        this.categories[this.getCategoryIndexById(id)].menuShow = false
      },
      getDefaultChartData () {
        return {
          listItems: [{ id: 1, title: 'a' }, { id: 2, title: 'b' }, { id: 3, title: 'c' }],
          selectedItem: null,
          acts: null,
        }
      },
      getDefaultGeneralData () {
        return {
          sum: null,
          description: '',
        }
      },
      clearData () {
        this.chargeData = this.getDefaultChartData()
        this.generalData = this.getDefaultGeneralData()
      },
      showSuccess (sum, mode) {
        this.success.active = true
        this.success.mode = mode
        this.success.data = sum
      },
      menuSave (category) {
        // === Data === //
        const sum = this.generalData.sum.replace(/[^\d]+/, '')
        // const description = this.generalData.description
        if (category.mode === 'charge') {
          this.showSuccess(sum, true)
        //   const acts = this.chargeData.acts.replace(/[^\d]+/, '')
        //   const operation = this.chargeData.selectedItem
        } else {
          this.showSuccess(sum, false)
        }
        // === Data === //
        this.clearData()
        category.menuShow = false
      },
    },
  }
</script>

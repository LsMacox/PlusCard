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
              @click="!category.menuShow ? menuOperation(category.id, 'writeOff') : menuClose(category.id)"
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
              @click="!category.menuShow ? menuOperation(category.id, 'charge') : menuClose(category.id)"
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
            <!-- <vue-select
              v-if="category.mode == 'charge'"
              class="card__body-select"
              label="Выберите операцию"
              :items="['dds', 'dsadsa', 'ddd']"
              solo
              hide-details
              :menu-props="{ auto: false, offsetY: 200 }"
            >

            </vue-select> -->
            <div class="card__body-select" />
            <div class="card__body-group">
              <v-text-field
                v-mask="getMask(category.mode)"
                class="panel-crm__form-input card__body-input"
                type="text"
                :placeholder="category.mode == 'writeOff' ? 'Списать:' : 'Начислить:'"
                outlined
                hide-details
              />
              <v-text-field
                v-if="category.mode == 'charge'"
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
  </div>
</template>

<script>
  // import vueSelect from 'vue-select'
  import { mask } from 'vue-the-mask'

  export default {
    directives: { mask },
    // components: { vueSelect },
    data () {
      return {
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
    methods: {
      getMask (mode) {
        return mode === 'writeOff' ? 'Списать: ###########' : 'Начислить: ###########'
      },
      getCategoryIndexById (id) {
        return this.$_.findIndex(this.categories, (category) => { return category.id === id })
      },
      menuOperation (id, mode) {
        const categoryIndex = this.getCategoryIndexById(id)

        this.categories[categoryIndex].mode = mode
        this.categories[categoryIndex].menuShow = true
      },
      menuClose (id) {
        this.categories[this.getCategoryIndexById(id)].menuShow = false
      },
    },
  }
</script>

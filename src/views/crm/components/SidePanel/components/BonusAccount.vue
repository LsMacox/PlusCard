<template>
  <div class="bonus-accounts">
    <div class="bonus-accounts__header">
      <p class="body-l-semibold">
        Бонусные счета
      </p>
    </div>
    <div class="bonus-accounts__cards">
      <div
        v-for="(item, i) in accountBalances"
        :key="i"
        class="bonus-accounts__card"
      >
        <div
          v-if="editedItem.unit_id !== item.unit_id"
          class="card__header"
        >
          <p class="card__header-title body-l-semibold">
            {{ item.name }}
          </p>
          <p class="card__header-count title-m-bold success--text">
            <span>{{ item.balance | spacesBetweenNumbers }}</span>
            <span
              v-if="item.of != undefined"
              class="neutral-400--text"
            >/{{ item.of }}</span>
          </p>
          <div class="card__header-control">
            <v-btn
              class="control-btn"
              color="primary-100"
              @click="!editedItem.menuShow ? menuOperation(item, 'debit') : menuClose()"
            >
              <iconify-icon
                :icon="!item.menuShow ? 'feather-minus' : 'jam-close'"
                width="15"
              />
            </v-btn>
            <v-btn
              class="control-btn"
              :class="{active: item.menuShow}"
              color="primary-100"
              @click="!item.menuShow ? menuOperation(item, 'credit') : menuClose()"
            >
              <iconify-icon
                :icon="!item.menuShow ? 'eva-plus-outline' : 'octicon-check-16'"
                width="15"
              />
            </v-btn>
          </div>
        </div>
        <div
          v-else
          class="card__body"
        >
          <div class="card__body-form">
            <!-- <vue-select
              v-if="item.mode == 'charge'"
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
                v-mask="getMask(item.mode)"
                class="panel-crm__form-input card__body-input"
                type="text"
                :placeholder="item.mode == 'writeOff' ? 'Списать:' : 'Начислить:'"
                outlined
                hide-details
              />
              <v-text-field
                v-if="item.mode == 'charge'"
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
    props: {
      loading: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        editedItem: {},
        operationMode: null,
      }
    },
    computed: {
      accountBalances () {
        const result = this.$store.getters['crm/clientCard/accountBalances']
        result.forEach(item => {
          if (!item.max_value) {
            item.icon = null
          }
        })
        return result
      },
    },
    methods: {
      getMask (mode) {
        return mode === 'writeOff' ? 'Списать: ###########' : 'Начислить: ###########'
      },
      menuOperation (item, operation) {
        console.log(item)
        this.operationMode = operation
        this.editedItem = item
      },
      menuClose () {
        this.operationMode = null
        this.editedItem = {}
      },
      getCategoryIndexById (id) {
        return this.$_.findIndex(this.categories, (category) => { return category.id === id })
      },
    },
  }
</script>

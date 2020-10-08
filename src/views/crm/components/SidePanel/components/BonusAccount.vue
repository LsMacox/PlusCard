<template>
  <div class="bonus-accounts">
    <div class="bonus-accounts__header">
      <p class="body-l-semibold">
        Бонусные счета
      </p>
    </div>
    <div
      v-if="loading"
    >
      <v-skeleton-loader
        type="table-tfoot"
      />
      <v-skeleton-loader
        type="table-tfoot"
      />
    </div>
    <div
      v-else
      class="bonus-accounts__cards"
    >
      <div
        v-for="(item, i) in accountBalances"
        :key="i"
        class="bonus-accounts__card"
      >
        <div class="card__header">
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
              @click="(editedItem.unit_id === item.unit_id && operationMode) ? menuClose() : menuOperation(item, 'debit')"
            >
              <iconify-icon
                :icon="(editedItem.unit_id === item.unit_id && operationMode) ? 'jam-close' : 'feather-minus'"
                width="15"
              />
            </v-btn>
            <v-btn
              class="control-btn"
              :class="{active: (editedItem.unit_id === item.unit_id && operationMode)}"
              color="primary-100"
              @click="(editedItem.unit_id === item.unit_id && operationMode) ? processing(item) : menuOperation(item, 'credit')"
            >
              <iconify-icon
                :icon="(editedItem.unit_id === item.unit_id && operationMode) ? 'octicon-check-16' : 'eva-plus-outline'"
                width="15"
              />
            </v-btn>
          </div>
        </div>
        <div
          v-if="editedItem.unit_id === item.unit_id"
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
                v-mask="getMask(operationMode)"
                class="panel-crm__form-input card__body-input"
                type="text"
                :placeholder="operationMode === 'debit' ? 'Списать:' : 'Начислить:'"
                outlined
                hide-details
              />
              <v-text-field
                v-if="operationMode === 'credit'"
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
      clientData: {
        type: Object,
        default: () => {},
      },
    },
    data () {
      return {
        loading: false,
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
    async created () {
      console.log(this.clientData)
      await this.fetchData()
    },
    methods: {
      getMask (mode) {
        return mode === 'debit' ? 'Списать: ###########' : 'Начислить: ###########'
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
      async processing (item) {
        try {
          this.loading = true
          const operation = {
            item,
          }
          console.log('processing')
          console.log(operation)
          // await this.$store.dispatch('crm/clientCard/getAccountBalances', operation)
          this.menuClose()
        } finally {
          this.loading = false
        }
      },
      async fetchData () {
        try {
          this.loading = true
          await this.$store.dispatch('crm/clientCard/getAccountBalances', this.clientData)
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

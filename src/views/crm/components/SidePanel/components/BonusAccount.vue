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
            <!-- списание/отмена -->
            <!-- блокируем операцию если нет ручного бонусного ресурса -->
            <v-btn
              v-if="editedItem.unit_id !== item.unit_id"
              class="control-btn"
              color="primary-100"
              :disabled="!isManual(item, 'TYPE_TARGET') || !valid"
              @click="menuOperation(item, 'FROM')"
            >
              <iconify-icon
                icon="feather-minus"
                width="15"
              />
            </v-btn>
            <v-btn
              v-else
              class="control-btn"
              color="primary-100"
              @click="menuClose()"
            >
              <iconify-icon
                icon="jam-close"
                width="15"
              />
            </v-btn>

            <!-- начисление/подтверждение -->
            <!-- блокируем операцию если нет ручного бонусного ресурса -->
            <v-btn
              v-if="editedItem.unit_id !== item.unit_id"
              class="control-btn"
              color="primary-100"
              :disabled="!isManual(item, 'TYPE_SOURCE') || !valid"
              @click="menuOperation(item, 'TO')"
            >
              <iconify-icon
                icon="eva-plus-outline"
                width="15"
              />
            </v-btn>
            <v-btn
              v-else
              class="control-btn active"
              color="primary-100"
              :loading="loadingOperation"
              @click="processing()"
            >
              <iconify-icon
                icon="octicon-check-16"
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
            <v-form
              v-model="valid"
            >
              <div class="card__body-select">
                <v-select
                  v-if="availableOperations.length > 1"
                  v-model="selectedBonusResourceId"
                  :items="availableOperations"
                  item-text="title"
                  item-value="score_id"
                  placeholder="Выберите операцию"
                  outlined
                  :ripple="false"
                >
                  <template v-slot:item="data">
                    <div style="display: flex; align-items: center;">
                      <div
                        v-if="data.attrs.inputValue"
                        :key="data.item.text + 'active'"
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
                        :key="data.item.text + 'inactive'"
                        class="inactive"
                      >
                        <span
                          class="iconify"
                          data-icon="eva:square-outline"
                          data-inline="false"
                        />
                      </div>
                      <span>{{ data.item.text + ' ' + data.attrs.inputValue }}</span>
                    </div>
                  </template>
                </v-select>
              </div>
              <div class="card__body-group">
                <v-text-field
                  v-model="operation.value"
                  v-mask="getMask(operationMode)"
                  class="panel-crm__form-input card__body-input"
                  type="text"
                  :placeholder="operationMode === 'FROM' ? 'Списать:' : 'Начислить:'"
                  outlined
                  hide-details
                />
                <v-text-field
                  v-if="operationMode === 'TO'"
                  v-model="operation.expired_days"
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
                  v-model="operation.comment"
                  class="panel-crm__form-input card__body-input"
                  rows="4"
                  placeholder="Введите комментарий (необязательно)"
                  outlined
                  auto-grow
                  hide-details
                  :rules="[
                    v => String(v).length <= 255 || 'Комментарий должен быть не более 255 символов'
                  ]"
                />
                <div class="textarea---angle" />
              </div>
            </v-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
        valid: true,
        loadingOperation: false,
        editedItem: {},
        operationMode: null,
        selectedBonusResourceId: null,
        operation: {
          value: null,
          expired_days: null,
          comment: null,
        },
      }
    },
    computed: {
      loading () {
        return this.$store.getters['crm/clientCard/loading']
      },
      bonusResources () {
        return this.$store.getters['company/bonus_resources/bonusResources']
      },
      // доступные ручные бонусные ресурсы
      availableOperations () {
        let type = null
        if (this.operationMode === 'FROM') type = 'TYPE_TARGET'
        if (this.operationMode === 'TO') type = 'TYPE_SOURCE'
        return this.bonusResources.filter(item => {
          return item.bonus_score.units_id == this.editedItem.unit_id &&
            item.resource_type_enum == type &&
            item.bonus_score && item.bonus_score.active &&
            (!item.rules || !item.rules.event)
        })
      },
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
        return mode === 'FROM' ? 'Списать: ###########' : 'Начислить: ###########'
      },
      isManual (unit, type) {
        const res = this.bonusResources.find(item => {
          return item.bonus_score.units_id == unit.unit_id &&
            item.resource_type_enum == type &&
            item.bonus_score && item.bonus_score.active &&
            (!item.rules || !item.rules.event)
        })
        if (res) return true
        return false
      },
      menuOperation (item, operation) {
        this.operationMode = operation
        this.editedItem = item
        console.log('menuOperation')
        console.log(this.availableOperations)
        if (this.availableOperations.length === 1) {
          this.selectedBonusResourceId = this.availableOperations[0].score_id
        }
      },
      menuClose () {
        this.operationMode = null
        this.selectedBonusResourceId = null
        this.operation = {
          value: null,
          expired_days: null,
          comment: null,
        }
        this.valid = true
        this.editedItem = {}
      },
      clearValue (v) {
        v = String(v).replace('Списать: ', '')
        v = v.replace('Начислить: ', '')
        return Number(v)
      },
      clearDays (v) {
        v = String(v).replace('Действуют: ', '')
        return Number(v)
      },
      async processing () {
        try {
          this.loadingOperation = true
          const operation = {
            account_id: this.clientData.id,
            direction: this.operationMode,
            value: this.clearValue(this.operation.value),
            expired_days: this.clearDays(this.operation.expired_days),
            comment: this.operation.comment,
          }
          if (this.operationMode === 'FROM') operation.score_target_id = this.selectedBonusResourceId
          if (this.operationMode === 'TO') operation.score_source_id = this.selectedBonusResourceId
          console.log('processing')
          console.log(operation)
          // await this.$store.dispatch('crm/clientCard/transactionsAdd', operation)
          // await this.$store.dispatch('crm/clientCard/getAccountBalances', this.clientData) // обнвление баланса
          this.$notify({
            type: 'success',
            title: 'Клиенты',
            text: 'Бонусная операция успешно проведена',
          })
          this.menuClose()
        } finally {
          this.loadingOperation = false
        }
      },
    },
  }
</script>

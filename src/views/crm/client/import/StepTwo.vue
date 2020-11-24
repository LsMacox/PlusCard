<template>
  <div class="my-stepper-import--form">
    <div class="my-stepper-import--form-header title-m-bold">
      Настройки импорта
    </div>
    <div
      class="body-m-regular"
      style="margin-top: 12px;"
    >
      Выберите в таблице ниже к кому типу отнести импортируемые данные.<br>
      Обязательные ячейки: телефон или email.
    </div>
    <div class="my-stepper-import--form-status">
      <div
        class="body-m-regular"
        style="font-weight: 600;"
      >
        Предварительно загружено: {{ excel.length }} {{ declOfNum(excel.length, rowStr) }}
      </div>
      <div
        v-if="errors.length"
        class="body-m-regular my-stepper-import--form-status-error-item my-stepper-import--form-status-error"
        @click="toErrorView('error')"
      >
        <v-icon>$iconify_bx-bxs-error-alt</v-icon>
        <span
          class="my-stepper-import--form-status-error-text"
        >{{ errors.length }} {{ declOfNum(errors.length, errorStr) }}
        </span>
      </div>
      <div
        v-if="warnings.length"
        class="body-m-regular my-stepper-import--form-status-error-item my-stepper-import--form-status-warning"
        @click="toErrorView('warning')"
      >
        <v-icon>$iconify_bx-bxs-error</v-icon>
        <span
          class="my-stepper-import--form-status-error-text"
        >{{ warnings.length }} {{ declOfNum(warnings.length, warningStr) }}</span>
      </div>
    </div>
    <div class="my-stepper-import--form-content">
      <div class="my-stepper-import--step-two">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th
                  v-for="(item, i) in headers"
                  :key="`header-${i}`"
                  class="text-left"
                >
                  <div>{{ item === '__rowNum__' ? '№' : item }}</div>
                  <div class="my-stepper-import--step-two-select">
                    <v-select
                      v-if="item !== '__rowNum__'"
                      v-model="cols[i]"
                      :items="types"
                      placeholder="Выберите тип ячейки"
                      outlined
                      hide-details
                      clearable
                      @change="syncCols(i)"
                    />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in rows"
                :key="`row-${i}`"
              >
                <td
                  v-for="(cell, j) in row"
                  :key="`cell-${i}${j}`"
                >
                  {{ cell }}
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </div>
    </div>
    <div class="my-stepper-import--form-action">
      <v-btn
        color="secondary"
        @click="back"
      >
        <iconify-icon
          icon="arrow-back"
          width="21"
          style="margin-right: 5px;"
        />
        Назад
      </v-btn>
      <div class="app__spacer" />
      <v-btn
        color="primary"
        :disabled="!isValidExcel"
        :loading="loading"
        @click="upload()"
      >
        <iconify-icon
          icon="clarity-import-line"
          width="21"
          style="margin-right: 5px;"
        />
        Загрузить базу
      </v-btn>
    </div>
    <error-view
      v-if="dialogError"
      :dialog.sync="dialogError"
      :errors="viewErr"
      :type="viewType"
    />
  </div>
</template>

<script>
  import convertor from '@/mixins/convertor'
  import { emailV } from '@/plugins/validate-rules'
  import { validPhone } from '@/utils/validate'
  import ErrorView from '@/views/crm/client/import/ErrorView'

  export default {
    components: {
      ErrorView,
    },
    mixins: [convertor],
    props: {
      step: {
        type: Number,
        default: 2,
      },
      excel: {
        type: Array,
        default: () => ([]),
      },
    },
    data () {
      return {
        valid: false,
        loading: false,
        maxCol: 8,
        types: [
          { value: 'phone', text: 'Телефон', required: true },
          { value: 'email', text: 'Email', required: true },
          { value: 'name', text: 'Имя', required: false },
          { value: 'lastname', text: 'Фамилия', required: false },
          { value: 'middlename', text: 'Отчество', required: false },
        ],
        cols: [], // колонки excel по типам
        errors: [], // ошибки
        warnings: [], // предупреждения
        viewErr: [], // просмотр ошибок
        viewType: null,
        rowStr: ['строка', 'строки', 'строк'],
        errorStr: ['ошибка', 'ошибки', 'ошибок'],
        warningStr: ['предупреждение', 'предупреждения', 'предупреждений'],
        selectedExcel: [], // excel по выбранным колонкам
        dialogError: false,
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
      headers () {
        if (this.excel.length) {
          return Object.keys(this.excel[0])
        }
        return []
      },
      rows () {
        if (this.excel.length) {
          return this.excel.slice(0, 5)
        }
        return []
      },
      isValidExcel () {
        let reqCount = 0
        let errors = []
        let warnings = []
        const req = this.types.filter(item => item.required)
        if (req.length) {
          req.forEach(item => {
            if (this.cols.indexOf(item.value) !== -1) {
              reqCount++
            }
          })
        }
        this.cols.forEach((type, i) => {
          if (type) {
            switch (type) {
              case 'phone':
                // errors.concat(this.checkingErrors(type, i))
                errors = errors.concat(this.checkingErrors(type, i))
                break
              case 'email':
                // errors.concat(this.checkingErrors(type, i))
                errors = errors.concat(this.checkingErrors(type, i))
                break
              default:
                warnings = warnings.concat(this.checkingWarnings(type, i))
                break
            }
          }
        })
        this.errors = errors
        this.warnings = warnings
        if (reqCount && !errors.length) {
          return true
        }
        return false
      },
    },
    methods: {
      back () {
        this.$emit('update:step', 1)
      },
      // выбор колонок
      syncCols (i) {
        const value = this.cols[i]
        this.cols.forEach((item, index) => {
          if (item === value && i !== index) {
            this.cols[index] = null
          }
        })
      },
      checkingErrors (type, i) {
        const errors = []
        this.excel.forEach((row) => {
          const col = Object.keys(row)[i]
          const rowNum = row.__rowNum__
          const cell = row[col]
          switch (type) {
            case 'phone':
              if (!cell) errors.push(`Строка ${(rowNum)}, колонка "${col}": Отсутствует номер телефона`)
              if (cell && !validPhone(cell)) errors.push(`Строка ${(rowNum)}, колонка "${col}": Номер телефона неверного формата`)
              break

            case 'email':
              if (!cell) errors.push(`Строка ${(rowNum)}, колонка "${col}": Отсутствует e-mail`)
              if (cell && !emailV(cell)) errors.push(`Строка ${(rowNum)}, колонка "${col}": E-mail неверного формата`)
              break
          }
        })
        return errors
      },
      checkingWarnings (type, i) {
        const warnings = []
        this.excel.forEach((row) => {
          const col = Object.keys(row)[i]
          const rowNum = row.__rowNum__
          const cell = row[col]
          if (!cell) warnings.push(`Строка ${(rowNum)}, колонка "${col}": Пустая ячейка`)
        })
        return warnings
      },
      toErrorView (type) {
        if (type === 'error') {
          this.viewErr = this.errors
        }
        if (type === 'warning') {
          this.viewErr = this.warnings
        }
        this.viewType = type
        this.dialogError = true
      },
      // подготовка excel
      getSelectedExcel () {
        const toUpload = []
        const excelMask = []
        this.cols.forEach((item, index) => {
          if (item) {
            excelMask.push({
              item,
              index,
            })
          }
        })
        this.excel.forEach(row => {
          const newRow = {}
          newRow.__rowNum__ = row.__rowNum__
          excelMask.forEach(mask => {
            let i = 0
            let cell = null
            for (const j in row) {
              if (i === mask.index) {
                cell = j
                break
              }
              i++
            }
            if (cell) {
              newRow[mask.item] = row[cell]
            }
          })
          toUpload.push(newRow)
        })
        console.log(toUpload)
        this.selectedExcel = Object.copy(toUpload)
      },
      async upload () {
        try {
          this.loading = true
          this.getSelectedExcel() // подготовка excel
          const item = {
            program_id: this.program.id,
            excel: this.selectedExcel,
          }
          await this.$store.dispatch('crm/client/createList', item)
          this.$emit('update:step', 3)
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>

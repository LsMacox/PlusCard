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
    <div
      class="body-m-regular"
      style="margin-top: 12px;"
    >
      Всего загружено: {{ excel.length }} {{ declOfNum(excel.length, rowStr) }}
    </div>
    <div class="my-stepper-import--form-content">
      <div class="my-stepper-import--step-two">
        {{ fields }}
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
                      v-model="fields[i]"
                      :items="types"
                      placeholder="Выберите тип ячейки"
                      outlined
                      hide-details
                      clearable
                      @change="syncModel(i)"
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
        :disabled="!isValidUpload"
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
  </div>
</template>

<script>
  import convertor from '@/mixins/convertor'

  export default {
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
        fields: [],
        rowStr: ['строка', 'строки', 'строк'],
      }
    },
    computed: {
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
      isValidUpload () {
        let reqCount = 0
        const req = this.types.filter(item => item.required)
        if (req.length) {
          req.forEach(item => {
            if (this.fields.indexOf(item.value) !== -1) {
              reqCount++
            }
          })
        }
        if (reqCount) {
          return true
        }
        return false
      },
    },
    methods: {
      back () {
        this.$emit('update:step', 1)
      },
      syncModel (i) {
        const value = this.fields[i]
        this.fields.forEach((item, index) => {
          if (item === value && i !== index) {
            this.fields[index] = null
          }
        })
      },
      async upload () {
        try {
          this.loading = true

          const toUpload = []
          const excelMask = []
          this.fields.forEach((item, index) => {
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

          await this.$store.dispatch('crm/client/createList', { excel: toUpload })
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

<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="80%"
  >
    <v-card>
      <div class="import-dialog">
        <div class="import-header">
          <div class="import-title title-m-bold">
            Импорт клиентов
          </div>
        </div>

        <div
          v-if="content"
          class="import-content"
        >
          <div class="import-menu">
            //
          </div>
          <div class="import-example">
            //
          </div>
        </div>
        <div
          v-else
          class="import-content-dummy"
        >
          <input
            ref="upload"
            class="import-content-dummy-input"
            type="file"
            accept=".xlsx, .xls, .csv"
            @change="handleUpload"
          >

          <div
            v-if="!loadingFile"
            class="import-content-dummy-area"
            @drop.stop.prevent="handleDrop"
            @dragover.stop.prevent="handleDragover"
            @dragenter.stop.prevent="handleDragover"
            @click="$refs.upload.click()"
          >
            <div class="import-content-dummy-icon">
              <iconify-icon
                icon="clarity-import-line"
              />
            </div>
            <div style="margin: 0 20px 20px 20px;">
              <div>
                Поместите файл с базой клиентов сюда<br>или <span class="import-content-dummy-link">нажмите для загрузки</span>
              </div>
              <div>Допустимые форматы файла: xlsx, xls, csv</div>
            </div>
          </div>

          <div
            v-else
            v-loading="loadingImport"
            class="drop-preloader"
          />
        </div>

        <div class="import-action">
          <div class="app__spacer" />
          <v-btn
            color="primary"
            :loadind="loadingImport"
            :disabled="!valid"
            @click="upload()"
          >
            <span
              class="iconify"
              data-icon="ant-design:plus-circle-outlined"
              data-inline="false"
            />
            Импортировать
          </v-btn>
          <v-btn
            color="secondary"
            style="margin-left: 15px;"
            @click="close()"
          >
            <span
              class="iconify"
              data-icon="ant-design:plus-circle-outlined"
              data-inline="false"
            />
            Закрыть
          </v-btn>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import XLSX from 'xlsx'

  export default {
    props: {
      dialog: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        valid: false,
        loadingFile: false,
        loadingImport: false,
        content: false,
      }
    },
    computed: {
    },
    methods: {
      close () {
        this.$emit('update:dialog', false)
      },
      handleDragover (e) {
        e.dataTransfer.dropEffect = 'copy'
      },
      handleDrop (e) {
        this.validateUpload(e.dataTransfer.files)
      },
      handleUpload (e) {
        this.validateUpload(e.target.files)
      },
      clearPhoneMask (p) {
        if (p) {
          p = String(p).match(/\d/g)
          if (p) p = p.join('')
        }
        return p
      },
      async validateUpload (files) {
        if (files.length > 1) return this.$store.commit('template/shared/errorMessage', 'Загружайте файлы по одному')
        const file = files[0]
        // let isExcel = /\.(xlsx|xls|csv)$/.test(file.name)
        const type = this.getType(file.name)
        // тип и размер файла
        if (!type) return this.$store.commit('template/shared/errorMessage', 'Недопустимый тип файла')
        if (file.size > 10240000) return this.$store.commit('template/shared/errorMessage', 'Размер файла более 10 МБ')
        // очищаем input
        this.$refs.upload.value = null
        // парсинг excel
        await this.readerData(file)
        // максимальный размер загружаемых строк
        if (this.excel.length > 10000) return this.$store.commit('template/shared/errorMessage', 'Объем данных более 10000 строк')
        // преобразование по шаблону
        const excel = []
        let error = null
        let double = false
        for (let i = 0; i < this.excel.length; i++) {
          const row = this.excel[i]
          excel[i] = []
          // проверка на обязательные колонки
          for (let x = 0; x < this.template.vars.length; x++) {
            let phoneName = null
            if (this.template.vars[x].is_phone) {
              phoneName = this.template.vars[x].name
              let check = false
              for (const col in row) {
                if (String(col).toLowerCase() === String(phoneName).toLowerCase()) {
                  check = true
                }
              }
              if (!check) {
                error = 'Отсутствует колонка "' + phoneName + '"'
                return this.$store.commit('template/shared/errorMessage', error)
              }
            }
          }
          for (const col in row) {
            // проверка на соответствие шаблону
            let checkCol = false
            let variable = null
            let value = null
            let isPhone = false
            this.template.vars.forEach(item => {
              if (String(col).toLowerCase() === String(item.name).toLowerCase()) {
                checkCol = true
                variable = item.variable
                value = String(row[col])
                isPhone = item.is_phone
              }
            })
            // проверка на пустую строку и включение в шаблон
            if (col !== '__EMPTY' && checkCol) {
              // валидация номера телефона
              if (isPhone) {
                const phone = this.clearPhoneMask(value)
                // номер отсутствует
                if (!phone) {
                  error = 'Строка ' + (row.__rowNum__ + 1) + ': Отсутствует номер'
                  return this.$store.commit('template/shared/errorMessage', error)
                }
                // проверка длины
                if (phone && phone.length !== 10) {
                  error = 'Строка ' + (row.__rowNum__ + 1) + ': Номер должен быть 10 символов'
                  return this.$store.commit('template/shared/errorMessage', error)
                }
                // проверка начала строки
                /*
                if (phone && phone[0] !== '7' && phone[0] !== '8') {
                    error = 'Строка ' + (row.__rowNum__ + 1) + ': Номер должен начинаться с 7 или 8'
                    return this.$store.commit('template/shared/errorMessage', error)
                }
                */
                // предупреждение о дубле
                for (let x = 0; x < excel.length; x++) {
                  for (let y = 0; y < excel[x].length; y++) {
                    if (excel[x][y].variable === variable && excel[x][y].value === value) {
                      double = true
                      error = 'Строка ' + (row.__rowNum__ + 1) + ': Номер телефона ' + value + ' дублируется в таблице'
                      this.doubleMsg.push(error)
                      // return this.$store.commit('template/shared/errorMessage', error)
                    }
                  }
                }
              }
              excel[i].push({
                variable,
                value,
              })
            }
          }
        }
        this.excel = Object.assign([], excel)
        // модальное окно предупреждения о дублях
        if (double) {
          this.doubleWarning()
        } else {
          this.upload()
        }
      },
      getType (name) {
        if (name.indexOf('.xlsx') !== -1) return 'xlsx'
        if (name.indexOf('.xls') !== -1) return 'xls'
        if (name.indexOf('.csv') !== -1) return 'csv'
        return false
      },
      readerData (rawFile) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = e => {
            const data = e.target.result
            // console.log(data);
            const workBook = XLSX.read(data, {
              type: 'binary',
              cellText: false,
              cellDates: true,
            })
            // console.log(workBook);
            const firstSheetName = workBook.SheetNames[0]
            // console.log(firstSheetName);
            const workSheet = workBook.Sheets[firstSheetName]
            // console.log(workSheet);
            // const headers = this.getHeaderRow(workSheet);
            // console.log(header);
            // const results = XLSX.utils.sheet_to_json(workSheet, { header: this.headers })
            const results = XLSX.utils.sheet_to_json(workSheet, {
              raw: false,
              dateNF: 'YYYY"-"MM"-"DD',
              // dateNF: 'YYYY"-"MM"-"DD" "HH":"mm":"ss',
              defval: '',
            })
            // console.log(results);
            this.excel = results
            resolve()
          }
          reader.readAsBinaryString(rawFile)
        })
      },
      getHeaderRow (sheet) {
        const headers = []
        const range = XLSX.utils.decode_range(sheet['!ref'])
        let C
        const R = range.s.r
        /* start in the first row */
        for (C = range.s.c; C <= range.e.c; ++C) {
          /* walk every column in the range */
          const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
          /* find the cell in the first row */
          let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
          if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
          headers.push(hdr)
        }
        return headers
      },
      doubleWarning () {
        this.dialogDouble = true
      },
      upload () {
        const excel = {
          id: this.taskId,
          template_id: this.templateId,
          excel: this.excel,
          //
          page: this.table.page,
          limit: this.table.limit,
          filter: this.table.filter,
          sort: this.table.sort,
        }
        // console.log(excel)
        this.$store.dispatch('task/number/createList', excel).then(() => {
          this.close()
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
.import-dialog {
  padding: 25px;
}

.import-header {
  display: flex;
  align-items: center;

  .import-title {

  }
}

.import-content {
  margin: 20px 0;

  .import-menu {

  }

  .import-example {

  }
}

.import-content-dummy {
  margin: 20px 0;

  .import-content-dummy-input {
    display: none;
    z-index: -9999;
  }

  .import-content-dummy-area {
    position: relative;
    text-align: center;
    border-radius: 5px;
    border: 1px dashed #CFD8DC;
    cursor: pointer;
    &:hover {
      border: 1px dashed #409eff;
    }

    .import-content-dummy-icon {
      margin-top: 10px;
      font-size: 72px;
      color: #B0BEC5;
    }

    .import-content-dummy-link {
      color: #409eff;
    }
  }
}

.import-action {
  display: flex;
  align-items: center;
}
</style>

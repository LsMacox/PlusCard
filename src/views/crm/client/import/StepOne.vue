<template>
  <div class="my-stepper-import--form">
    <div class="my-stepper-import--form-header title-m-bold">
      Импорт клиентов
    </div>
    <div class="my-stepper-import--form-content">
      <div class="my-stepper-import--step-one">
        <input
          ref="upload"
          class="my-stepper-import--drop-input"
          type="file"
          accept=".xlsx, .xls, .csv"
          @change="handleUpload"
        >

        <div
          class="my-stepper-import--drop"
        >
          <div
            v-if="!loading"
            class="my-stepper-import--drop-area"
            @drop.stop.prevent="handleDrop"
            @dragover.stop.prevent="handleDragover"
            @dragenter.stop.prevent="handleDragover"
            @click="$refs.upload.click()"
          >
            <div class="my-stepper-import--upload-icon">
              <iconify-icon
                icon="clarity-import-line"
              />
            </div>
            <div class="my-stepper-import--upload-text">
              <div>
                Поместите файл с базой клиентов сюда<br>или <span class="my-stepper-import--upload-link">нажмите для загрузки</span>
              </div>
              <div>Допустимые форматы файла: xlsx, xls, csv</div>
            </div>
          </div>

          <div
            v-else
            class="my-stepper-import--drop-area-preloader"
          >
            <v-progress-circular
              :size="70"
              color="primary"
              indeterminate
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import XLSX from 'xlsx'

  export default {
    props: {
      step: {
        type: Number,
        default: 1,
      },
      excel: {
        type: Array,
        default: () => ([]),
      },
    },
    data () {
      return {
        loading: false,
        excelBuf: [],
      }
    },
    computed: {},
    methods: {
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
        try {
          this.loading = true

          if (files.length > 1) {
            return this.$notify({
              type: 'error',
              title: 'Импорт клиентов',
              text: 'Загружайте файлы по одному',
            })
          }
          const file = files[0]
          // let isExcel = /\.(xlsx|xls|csv)$/.test(file.name)
          const type = this.getType(file.name)
          // тип и размер файла
          if (!type) {
            return this.$notify({
              type: 'error',
              title: 'Импорт клиентов',
              text: 'Неверный тип файла',
            })
          }
          if (file.size > 10240000) {
            return this.$notify({
              type: 'error',
              title: 'Импорт клиентов',
              text: 'Размер файла более 10 МБ',
            })
          }
          // очищаем input
          this.$refs.upload.value = null
          // парсинг excel
          await this.readerData(file)
          // максимальный размер загружаемых строк
          if (this.excelBuf.length > 10000) {
            return this.$notify({
              type: 'error',
              title: 'Импорт клиентов',
              text: 'Объем данных более 10000 строк',
            })
          }
          this.$emit('update:excel', this.excelBuf)
          this.$emit('update:step', 2)
        } finally {
          this.loading = false
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
            // console.log(results)
            // подготовка результаов
            results.forEach(item => {
              const row = {}
              for (const key in item) {
                // номер строки
                row.__rowNum__ = item.__rowNum__
                // убираем пустые ячейки
                if (key.indexOf('EMPTY') === -1) {
                  row[key] = item[key]
                }
              }
              this.excelBuf.push(row)
            })
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
    },
  }
</script>

<style lang="scss" scoped>

</style>

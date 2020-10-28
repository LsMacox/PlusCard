<template>
  <div class="tab-document">
    <!-- ПУСТОЙ СПИСОК -->
    <div
      v-if="!showForm && !documents.length"
      class="tab-document__empty"
    >
      <base-empty sub-text="Прикрепляйте любые документы, которые могут понядобится клиенту. Он увидит их в приложении." />
      <v-btn
        color="primary"
        class="empty-btn"
        @click="openCreateForm"
      >
        <iconify-icon
          class="icon-attach"
          icon="ion-attach"
          width="21"
        />
        <p class="body-m-semibold">
          Прикрепить документ
        </p>
      </v-btn>
    </div>
    <!-- СПИСОК ДОКУМЕНТОВ -->
    <div
      v-if="!showForm && documents.length"
      class="tab-document__preview"
    >
      <div
        v-for="doc in documents"
        :key="doc.id"
        class="preview__card"
      >
        <div class="card__header">
          <div class="header-right">
            <p class="body-l-semibold neutral-900--text">
              {{ doc.name }}
            </p>
            <p class="body-m-regular">
              {{ doc.description }}
            </p>
            <div class="time">
              <iconify-icon
                class="icon-clock"
                icon="feather-clock"
                width="15"
              />
              <p class="body-s-medium neutral-500--text">
                {{ getPeriod(doc) }}
              </p>
            </div>
          </div>
          <div class="header-left">
            <a
              href="#delete"
              @click.prevent="remove(doc.id)"
            >
              <iconify-icon
                class="icon-trash"
                icon="feather-trash"
                width="21"
              />
            </a>
            <a
              href="#edit"
              @click.prevent="openEditForm(doc)"
            >
              <iconify-icon
                class="icon-edit"
                icon="feather-edit"
                width="21"
              />
            </a>
          </div>
        </div>
        <div class="card__content">
          <v-carousel
            cycle
            height="251"
            hide-delimiter-background
            show-arrows-on-hover
            next-icon="$iconify_chevron-right"
            prev-icon="$iconify_chevron-left"
          >
            <v-carousel-item
              v-for="(docFile, i) in doc.files"
              :key="i"
            >
              <v-sheet
                height="100%"
              >
                <v-row
                  class="fill-height neutral-100"
                  align="center"
                  justify="center"
                >
                  <v-img
                    class="fill-height"
                    :src="docFile.url"
                    alt="img"
                  />
                </v-row>
              </v-sheet>
            </v-carousel-item>
          </v-carousel>
        </div>
      </div>
      <v-btn
        color="primary"
        class="btn-attach"
        @click="openCreateForm"
      >
        <iconify-icon
          class="icon icon-attach"
          icon="ion-attach"
          width="21"
        />
        <p class="body-m-semibold">
          Прикрепить документ
        </p>
      </v-btn>
    </div>
    <!-- ФОРМА ДОКУМЕНТА -->
    <div
      v-if="showForm"
      class="tab-document__form"
    >
      <v-form
        ref="form"
        v-model="valid"
      >
        <div class="tab-document__form-block">
          <div class="form-block__header">
            <p class="body-l-semibold neutral-900--text">
              Название документа
            </p>
            <p class="body-m-regular neutral-700--text">
              Введите название документа, который вы прикрепляете, чтобы клиент мог понять вид документа.
            </p>
          </div>
          <div class="form-block__content">
            <base-text-field
              v-model="form.name"
              :rules="[
                v => !!v || 'Название документа обязательно для заполнения',
                v => String(v).length <= 255 || 'Название документа должно быть не более 255 символов',
              ]"
              validation-placement="left"
              placeholder="Например, чек"
            />
          </div>
        </div>
        <div class="tab-document__form-block">
          <div class="form-block__header">
            <p class="body-l-semibold neutral-900--text">
              Комментарий к документу
            </p>
            <p class="body-m-regular neutral-700--text">
              Опишите документ, который вы прикрепляете, чтобы клиент мог понять о чем идет речь.
            </p>
          </div>
          <div class="form-block__content">
            <base-text-area
              v-model="form.description"
              hide-details
              rows="4"
              placeholder="Например, телевизор Philips 43ETRY"
              :rules="[
                v => String(v).length <= 255 || 'Описание документа должно быть не более 255 символов',
              ]"
            />
          </div>
        </div>
        <div class="tab-document__form-block">
          <div class="form-block__header">
            <p class="body-l-semibold neutral-900--text">
              Срок действия
            </p>
            <p class="body-m-regular neutral-700--text">
              Введите период действия документа. Оставьте поля пустыми, если документ имеет неограниченный срок.
            </p>
          </div>
          <div class="form-block__content">
            <base-date-text-field
              v-model="form.started_at"
              :date-format="DATE_FORMAT"
              class="date-start"
              placeholder="Действует с"
            />
            <base-date-text-field
              v-model="form.expired_at"
              :date-format="DATE_FORMAT"
              class="date-end"
              placeholder="Действует до"
            />
          </div>
        </div>
        <div class="tab-document__form-block">
          <div class="form-block__header">
            <p class="body-l-semibold neutral-900--text">
              Фото документа
            </p>
            <p class="body-m-regular neutral-700--text">
              Прикрепите фотографии или сканы документа.
            </p>
          </div>
          <div class="form-block__content">
            <div
              v-for="(file, i) in form.files"
              :key="i"
              class="attach-img"
            >
              <v-btn
                class="btn-close"
                @click="removeFile(i)"
              >
                <iconify-icon
                  class="icon-close"
                  icon="ion-close-circle"
                  width="26"
                />
              </v-btn>
              <img
                :src="file.preview"
                alt="img"
              >
            </div>
            <div
              class="attach-box"
              @click="$refs.file.click()"
            >
              <v-btn
                class="btn-attach"
                color="primary-100"
              >
                <iconify-icon
                  class="icon-plus"
                  icon="feather-plus-circle"
                  width="21"
                />
              </v-btn>
              <input
                ref="file"
                class="d-none"
                type="file"
                multiple
                @change="addFile"
              >
            </div>
          </div>
        </div>
        <div class="tab-document__form-buttons">
          <v-btn
            v-if="formMode"
            color="primary"
            class="form-btn"
            :loading="loading"
            :disabled="!valid"
            @click="create"
          >
            <iconify-icon
              class="icon icon-attach"
              icon="ion-attach"
              width="21"
            />
            <p class="body-m-semibold">
              Прикрепить документ
            </p>
          </v-btn>
          <v-btn
            v-else
            color="primary"
            class="form-btn"
            :loading="loading"
            :disabled="!valid"
            @click="edit"
          >
            <iconify-icon
              class="icon icon-checkmark"
              icon="ion-checkmark-circle-outline"
              width="21"
            />
            <p class="body-m-semibold">
              Сохранить
            </p>
          </v-btn>
          <div
            class="form-btn-close"
            @click="closeForm"
          >
            <a
              href="#close"
              class="neutral-500--text"
            >
              <iconify-icon
                icon="ion-close-circle-outline"
                class="icon icon-close"
                width="21"
              />
              <p class="body-s-semibold">Отмена</p>
            </a>
          </div>
        </div>
      </v-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TabDocument',
    props: {
      clientData: {
        type: Object,
        default: () => {
          return {}
        },
      },
    },
    data () {
      return {
        valid: true,
        loading: false,
        DATE_FORMAT: 'DD.MM.YYYY',
        form: {
          id: null,
          account_id: null,
          name: null,
          description: null,
          started_at: null,
          expired_at: null,
          files: [],
        },
        documentId: NaN,
        documentName: '',
        documentDescription: '',
        documentPeriod: {
          start: '',
          end: '',
        },
        documentFiles: [],
        showForm: false,
        formMode: true, // true = create, false = edit
        validate: false,
      }
    },
    computed: {
      accountClient () {
        return this.$store.getters['crm/clientCard/client']
      },
      documents () {
        return this.$store.getters['crm/clientDocument/documents']
      },
    },
    watch: {
      documentName () {
        this.validator()
      },
      documentDescription () {
        this.validator()
      },
      documentFiles () {
        this.validator()
      },
      documentPeriod: {
        deep: true,
        handler () {
          this.validator()
        },
      },
    },
    async created () {
      await this.fetchData()
    },
    methods: {
      validator () {
        const start = this.$moment(this.documentPeriod.start)
        const end = this.$moment(this.documentPeriod.end)
        const periodDiff = end.diff(start, 'days')
        if (
          !!this.documentName.length &&
          !!this.documentDescription.length &&
          !!this.documentFiles.length
        ) {
          this.validate = true
          if (isNaN(periodDiff) || periodDiff < 1 || periodDiff > 1001) this.validate = false
        } else {
          this.validate = false
        }
      },
      getPeriod (doc) {
        const DATE_FORMAT = 'DD MMM YYYY'
        const start = this.$moment(doc.started_at)
        const end = this.$moment(doc.expired_at)
        const diff = end.diff(start, 'days')

        return isNaN(diff)
          ? 'Неограничен'
          : start.format(DATE_FORMAT) + ' - ' + end.format(DATE_FORMAT)
      },
      openCreateForm () {
        this.clearData()
        this.showForm = true
        this.formMode = true
      },
      openEditForm (item) {
        console.log('openEditForm')
        console.log(item)
        this.showForm = true
        this.formMode = false
        this.$nextTick(() => {
          this.form = Object.copy(item)
          this.form.files.forEach(item => {
            item.preview = item.url
          })
        })
      },
      closeForm () {
        this.showForm = false
      },
      clearData () {
        this.form = {
          id: null,
          account_id: null,
          name: null,
          description: null,
          started_at: null,
          expired_at: null,
          files: [],
        }
        this.documentId = NaN
        this.documentName = ''
        this.documentDescription = ''
        this.documentPeriod.start = ''
        this.documentPeriod.end = ''
        this.documentFiles = []
      },
      fillData (name, description, period, files) {
        this.documentName = name
        this.documentDescription = description
        this.documentPeriod.start = period.start || ''
        this.documentPeriod.end = period.end || ''
        this.documentFiles = [...files]
      },
      async addFile (e) {
        const files = e.target.files

        for (let i = 0; i < files.length; i++) {
          const url = URL.createObjectURL(files[i])
          const item = {
            file: files[i], // file
            preview: url, // blob url
          }
          this.form.files.push(item)
        }
      },
      removeFile (index) {
        console.log('removeFile')
        console.log(index)
        if (this.form.files[index] && this.form.files[index].id) {
          console.log('removed real file')
        } else {
          this.form.files.splice(index, 1)
        }
      },
      async create () {
        try {
          this.loading = true
          // FormData
          const item = new FormData()
          item.set('account_id', this.accountClient.id)
          item.set('name', this.form.name)
          item.set('description', this.form.description)
          // if (this.form.started_at) item.set('started_at', this.form.started_at)
          // if (this.form.expired_at) item.set('expired_at', this.form.expired_at)
          // item.set('started_at', null)
          // item.set('expired_at', null)
          // добавляем файлы
          if (Array.isArray(this.form.files)) {
            for (let i = 0; i < this.form.files.length; i++) {
              const file = this.form.files[i].file // добавляем файл
              item.append('files[' + i + ']', file)
            }
          }
          console.log(item)
          await this.$store.dispatch('crm/clientDocument/create', item)
        } finally {
          this.loading = false
          this.closeForm()
        }
      },
      async edit () {
        try {
          this.loading = true
          // FormData
          const item = new FormData()
          item.set('id', this.form.id)
          item.set('name', this.form.name)
          item.set('description', this.form.description)
          // if (this.form.started_at) item.set('started_at', this.form.started_at)
          // if (this.form.expired_at) item.set('expired_at', this.form.expired_at)
          // item.set('started_at', null)
          // item.set('expired_at', null)
          // добавляем файлы
          if (Array.isArray(this.form.files)) {
            for (let i = 0; i < this.form.files.length; i++) {
              const file = this.form.files[i].file // добавляем файл
              item.append('files[' + i + ']', file)
            }
          }
          console.log(item)
          // await this.$store.dispatch('crm/clientDocument/update', item)
        } finally {
          this.loading = false
          this.closeForm()
        }
      },
      async remove (id) {
        // example
        this.documents = this.documents.filter(doc => {
          return (doc.id !== id)
        })
      },
      async fetchData () {
        try {
          this.loading = true
          const item = {
            account_id: this.accountClient.id,
            page: 1,
            limit: 20,
          }
          await this.$store.dispatch('crm/clientDocument/list', item)
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss">
@import '@/styles/vuetify-preset-plus/light_theme/_variables.sass';

.tab-document {
  margin-top: 275px;
  p {
    margin-bottom: 0;
  }
  .tab-document__empty {
    margin-top: calc(270px + 84px);
    margin-bottom: 34px;
    text-align: center;
    .empty-btn {
      margin-top: 34px;
    }
    .icon-attach {
      margin-right: 12px;
    }
  }
  .tab-document__form {
    .tab-document__form-block {
      margin-top: 34px;
      .form-block__header {
        p {
          &:nth-child(2) {
            margin-top: 4px;
            margin-bottom: 20px;
          }
        }
      }
      &:nth-child(3) {
        .form-block__content {
          display: flex;
          .date-start {
            margin-right: 10px;
            .date-range-picker {
              right: inherit !important;
              left: 0 !important;
            }
          }
          .date-end {
            margin-left: 10px;
          }
        }
      }
      &:nth-child(4) {
        .form-block__content {
          display: flex;
          flex-wrap: wrap;
          .attach-box {
            display: flex;
            justify-content: center;
            align-items: center;
            margin-bottom: 20px;
            cursor: pointer;
            width: 125px;
            height: 125px;
            background: $primary-100;
            border-radius: 12px;
            transition: all .2s ease-in-out;
            .btn-attach {
              width: 100%;
              height: 100%;
              border-radius: 12px;
              .icon-plus {
                position: relative;
                color: $primary-base;
              }
            }

            &:hover {
              box-shadow: 0px 0px 3px $neutral-400;
            }
          }
          .attach-img {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            width: 125px;
            height: 125px;
            border-radius: 12px;
            overflow: hidden;
            margin-right: 20px;
            margin-bottom: 20px;
            img {
              text-align: center;
              vertical-align: middle;
            }
            .btn-close {
              position: absolute;
              right: 8px;
              top: 8px;
              width: 20px;
              height: 20px;
              min-width: 0;
              padding: 0 !important;
              border-radius: 50px;
              .icon-close {
                color: $primary-base;
                cursor: pointer;
                &:hover {
                  & + &:before {
                    box-shadow: 0px 0px 3px $neutral-400;
                  }
                }
              }
            }
            &:nth-child(3n) {
              margin-right: 0;
            }
          }
        }
      }
    }
    .tab-document__form-buttons {
      margin-top: 28px;
      margin-bottom: 34px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .form-btn {
        display: flex;
        align-items: center;
        .icon {
          margin-right: 8px;
        }
      }
      .form-btn-close {
        display: inline-block;
        cursor: pointer;
        .icon-close {
          color: $neutral-500;
          margin-right: 6px;
        }
        a {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: $neutral-500;
        }
      }
    }
  }
  .tab-document__preview {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .preview__card {
      border: 1px solid $neutral-250;
      box-shadow: 0px 24px 20px -16px rgba(88, 93, 106, 0.1);
      border-radius: 10px;
      overflow: hidden;
      &:not(:first-child) {
        margin-top: 9px;
      }
      .card__header {
        display: flex;
        justify-content: space-between;
        margin: 20px;
        .header-right {
          p {
            &:nth-child(1) {
              margin-bottom: 6px;
            }
          }
          .time {
            margin-top: 14px;
            display: flex;
            align-items: center;
            .icon-clock {
              color: $neutral-500;
              margin-right: 7px;
            }
          }
        }
        .header-left {
          a {
            text-decoration: none;
            color: $neutral-500;
            .icon-trash {
              margin-right: 20px;
            }
          }
        }
      }
    }
    .btn-attach {
      margin: 35px auto 34px auto;
      width: 226px;
      .icon-attach {
        margin-right: 8px;
      }
    }
  }
}
</style>

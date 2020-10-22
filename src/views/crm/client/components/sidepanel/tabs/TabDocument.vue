<template>
  <div class="tab-document">
    <div
      v-if="!showForm"
      class="tab-document__empty"
    >
      <base-empty sub-text="Прикрепляйте любые документы, которые могут понядобится клиенту. Он увидит их в приложении." />
      <v-btn
        color="primary"
        class="empty-btn"
        @click="attachDocument"
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
    <div
      v-if="showForm"
      class="tab-document__form"
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
            v-model="documentName"
            :rules="[v => !!v || 'Обязательно для заполнения']"
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
            v-model="documentDescription"
            hide-details
            placeholder="Например, телевизор Philips 43ETRY"
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
            v-model="documentPeriod.start"
            class="date-start"
            placeholder="Действует с"
          />
          <base-date-text-field
            v-model="documentPeriod.end"
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
            v-for="(file, i) in documentFiles"
            :key="i"
            class="attach-img"
          >
            <img
              :src="file.temporal_img_url"
              alt="img"
            >
          </div>
          <div
            class="attach-box"
            @click.prevent="$refs.uploadFiles.click()"
          >
            <iconify-icon
              class="icon-plus"
              icon="feather-plus-circle"
              width="21"
            />
            <input
              ref="uploadFiles"
              type="file"
              style="display:none;"
              multiple
              @change="uploadFiles"
            >
          </div>
        </div>
      </div>
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
            class="icon-close"
            width="21"
          />
          <p class="body-s-semibold">Отмена</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TabDocument',
    props: {},
    data () {
      return {
        documentName: '',
        documentDescription: '',
        documentPeriod: {
          start: '',
          end: '',
        },
        documentFiles: [],
        showForm: false,
      }
    },
    computed: {},
    mounted () {},
    methods: {
      uploadFiles (e) {
        const files = e.target.files

        files.forEach(file => {
          const url = URL.createObjectURL(file)
          this.documentFiles.push({ temporal_img_url: url, file })
        })
        console.log(this.documentFiles)
      },
      attachDocument () {
        this.showForm = true
      },
      closeForm () {
        this.showForm = false
      },
    },
  }
</script>

<style lang="scss">
@import '@/styles/vuetify-preset-plus/light_theme/_variables.sass';

.tab-document {
  p {
    margin-bottom: 0;
  }
  .tab-document__empty {
    margin-top: calc(270px + 84px);
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
          .attach-box {
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            width: 125px;
            height: 125px;
            background: $primary-100;
            border-radius: 12px;
            transition: all .2s ease-in-out;
            .icon-plus {
              color: $primary-base;
            }
            &:hover {
              box-shadow: 0px 0px 3px $neutral-400;
            }
          }
        }
      }
    }
    .form-btn-close {
      margin-top: 36px;
      margin-bottom: 30px;
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
</style>

<template>
  <div class="setting-chat">
    <base-top-menu @cancelbutton="$router.back()">
      <template v-slot:header>
        <p class="body-l-semibold">
          Настройки чатов
        </p>
      </template>
      <template>
        <div class="setting-chat__form">
          <div class="setting-chat__block miniature">
            <div class="miniature-left">
              <p class="title-m-bold neutral-900--text">
                Фотография в чате
              </p>
              <p class="body-m-regular neutral-700--text">
                Загрузите фото, которое будут видеть ваши
                клиенты при общении с вами в чате.
                Допустимые форматы: png, jpg до 10 Мб.
              </p>
            </div>
            <div class="miniature-right">
              <v-btn
                class="btn-download"
                color="primary-100"
                @click="$refs.fieldAvatar.click()"
              >
                <div
                  v-if="!Object.keys(imgAvatar).length"
                  class="none-img"
                >
                  <iconify-icon
                    icon="feather-download"
                    class="icon-download"
                    width="21"
                  />
                </div>
                <img
                  v-else
                  :src="imgAvatar.img_url"
                  alt="avatar"
                >
                <input
                  ref="fieldAvatar"
                  type="file"
                  class="d-none"
                  @change="uploadAvatar"
                >
              </v-btn>
            </div>
          </div>
          <div class="setting-chat__block representative-name">
            <div class="setting-chat__header representative-name__header">
              <p class="title-m-bold neutral-900--text">
                Представитель компании
              </p>
              <p class="body-m-regular neutral-700--text">
                Введите имя, которое будут видеть ваши клиенты при общении с вами в чате. Например, менеджер Михахил, директор Алексей Игоревич, компания Вектор.
              </p>
            </div>
            <div class="representative-name__content">
              <base-text-field
                class="setting-chat__field representative-name__field"
                placeholder="Имя представителя компании"
              />
              <div class="representative-name__description body-m-regular neutral-700--text">
                Включите эту опцию, если хотите, чтобы клиенты видели реальные имена ваших сотрудников, вместо введенного выше псевдонима.
              </div>
              <div class="setting-chat__checkbox representative-name__checkbox">
                <v-switch
                  label="Использовать реальное имя соотрудника"
                  inset
                  hide-details
                  class="custom-switch"
                  :loading="loading"
                  :disabled="loading"
                />
              </div>
            </div>
          </div>
          <div class="setting-chat__block welcome-message">
            <div class="setting-chat__header welcome-message__header">
              <p class="title-m-bold neutral-900--text">
                Приветсвенное сообщение
              </p>
              <p class="body-m-regular neutral-700--text">
                Введите имя, которое будут видеть ваши клиенты при общении с вами в чате. Например, менеджер Михахил, директор Алексей Игоревич, компания Вектор.
              </p>
            </div>
            <div class="welcome-message__content">
              <base-text-area
                class="setting-chat__field welcome-message__field"
                placeholder="Введите приветственное сообщение."
                hide-details
                rows="1"
                row-height="30"
              />
            </div>
          </div>
          <div class="setting-chat__block chat-visibility">
            <div class="setting-chat__checkbox chat-visibility__checkbox">
              <v-switch
                label="Чат активен"
                inset
                hide-details
                class="custom-switch"
                :loading="loading"
                :disabled="loading"
              />
            </div>
          </div>
        </div>
      </template>
    </base-top-menu>
  </div>
</template>

<script>
  import { extend, validate } from 'vee-validate'
  import { ext, size } from 'vee-validate/dist/rules'
  extend('ext', ext)
  extend('size', size)

  export default {
    data () {
      return {
        loading: false,
        imgAvatar: {},
      }
    },
    computed: {
    },
    mounted () {},
    created () {},
    methods: {
      uploadAvatar (e) {
        if (e.target.files[0]) {
          const file = e.target.files[0]

          validate(file, 'ext:jpg,png|size:10000')
            .then(result => {
              if (result.valid) {
                const url = URL.createObjectURL(file)
                this.imgAvatar = { img_url: url, file: file }
              }
            })
        }
      },
    },
  }
</script>

<style lang="scss">
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";
@import "@/styles/_typography.sass";

.setting-chat {
  // default
  p {
    margin-bottom: 0;
  }
  .setting-chat__form {
    width: 676px;
    margin: 68px auto;
    .setting-chat__block {
      margin-top: 68px;
      // main
      .setting-chat__header {
        p {
          &:nth-child(1) {
            margin-bottom: 24px;
          }
        }
      }
      .setting-chat__field {
        border-radius: 10px !important;
        input, textarea {
          @include body-m-medium;
          color: $neutral-900 !important;
          &::placeholder {
            color: $neutral-600 !important;
          }
        }
      }
      .setting-chat__checkbox {}
      .btn-download {
        overflow: hidden;
      }

      // custom
      &.miniature {
        margin-top: 0;
        display: flex;
        .miniature-left {
          p {
            &:nth-child(1) {
              margin-bottom: 12px;
            }
            &:nth-child(2) {
              width: 308px;
            }
          }
        }
        .miniature-right {
          margin-top: 10px;
          margin-left: 44px;
          .btn-download {
            width: 115px;
            height: 115px;
            border-radius: 50%;
            .icon-download {
              color: $primary-base;
            }
          }
        }
      }

      &.representative-name {
        .representative-name__content {
          .representative-name__field {
            margin-top: 16px !important;
          }
          .representative-name__description {
            margin-top: 24px;
            margin-bottom: 16px;
          }
        }
      }

      &.welcome-message {
        .welcome-message__content {
          .welcome-message__field {
            margin-top: 24px;
            textarea {
              margin-top: 13px !important;
            }
          }
        }
      }

    }
  }
}

</style>

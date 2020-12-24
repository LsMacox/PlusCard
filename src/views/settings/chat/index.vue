<template>
  <div class="setting-chat">
    <base-top-menu
      :loading="saveAction"
      :show-action="hasChanges && valid"
      action-button-text="Сохранить"
      @cancelbutton="cancelEdit()"
      @actionbutton="saveChanges()"
    >
      <template v-slot:header>
        <p class="body-l-semibold">
          Настройки чатов
        </p>
      </template>
      <template>
        <div class="setting-chat__form">
          <v-skeleton-loader
            :loading="ProgramReadAction"
            :style="{height: '100%', width: '100%'}"
            type="image@3, actions"
          >
            <template>
              <v-form
                ref="form"
                v-model="valid"
              >
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
                        v-if="!chatUserEditing.avatar_full"
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
                        :src="chatUserEditing.avatar_full"
                        width="115px"
                        height="115px"
                        alt="avatar"
                      >
                      <input
                        ref="fieldAvatar"
                        type="file"
                        class="d-none"
                        accept="image/jpeg,image/png"
                        @change="uploadAvatar"
                      >
                      <image-cropper
                        v-if="cropperSmallDialog"
                        :p-dialog.sync="cropperSmallDialog"
                        :p-title="'Загрузка аватара'"
                        :p-img.sync="smallImg"
                        :p-selected.sync="selectedImg"
                        :p-aspect-ratio="1"
                        :p-circle="true"
                      />
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
                      v-model="chatUserEditing.name"
                      class="setting-chat__field representative-name__field"
                      placeholder="Имя представителя компании"
                    />
                    <div class="representative-name__description body-m-regular neutral-700--text">
                      Включите эту опцию, если хотите, чтобы клиенты видели реальные имена ваших сотрудников, вместо введенного выше псевдонима.
                    </div>
                    <div class="setting-chat__checkbox representative-name__checkbox">
                      <base-ext-switch
                        v-model="programModelEditing.real_chat_name"
                        label="Использовать реальное имя сотрудника"
                      />
                    </div>
                  </div>
                </div>
                <div class="setting-chat__block welcome-message">
                  <div class="setting-chat__header welcome-message__header">
                    <p class="title-m-bold neutral-900--text">
                      Приветственное сообщение
                    </p>
                    <p class="body-m-regular neutral-700--text">
                      Введите имя, которое будут видеть ваши клиенты при общении с вами в чате. Например, менеджер Михахил, директор Алексей Игоревич, компания Вектор.
                    </p>
                  </div>
                  <div class="welcome-message__content">
                    <base-text-area
                      v-model="programModelEditing.chat_welcome"
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
                    <base-ext-switch
                      v-model="programModelEditing.can_write"
                      label="Чат активен"
                    />
                  </div>
                </div>
              </v-form>
            </template>
          </v-skeleton-loader>
        </div>
      </template>
    </base-top-menu>
  </div>
</template>

<script>
  import ImageCropper from '@/components/dialogs/ImageCropper'
  import { mapGetters, mapActions } from 'vuex'
  import { extend, validate } from 'vee-validate'
  import { ext, size } from 'vee-validate/dist/rules'
  extend('ext', ext)
  extend('size', size)

  export default {
    components: {
      ImageCropper,
    },
    data () {
      return {
        valid: false,
        cropperSmallDialog: false,
        selectedImg: null,
        smallImg: null,

        saveAction: false,
        programModelEditing: {
          can_write: false,
          real_chat_name: false,
          chat_welcome: '',
        },
        chatUserEditing: {
          name: '',
          avatar_full: null,
        },

      }
    },
    computed: {
      ...mapGetters({
        programId: 'programId',
        programModel: 'company/program/programModel',
        chatUser: 'chat/chatUser/chatUser',
      }),

      hasChanges () {
        return this.hasProgramChanges || this.hasChatUserChanges
      },
      hasProgramChanges () {
        return JSON.stringify(this.getEditFields(this.programModelEditing)) !== JSON.stringify(this.getEditFields(this.programModel))
      },
      hasChatUserChanges () {
        return JSON.stringify(this.chatUserEditing) !== JSON.stringify(this.chatUser)
      },
      hasModeratedChanges () {
        return this.programModelEditing.chat_welcome !== this.programModel.chat_welcome
      },
      smallImgBlob () {
        if (this.smallImg && this.smallImg.data.indexOf('base64') !== -1) {
          return this.smallImg.data.split(',')[1]
        } else return null
      },

    },
    watch: {
      smallImg (v) {
        if (v) {
          this.chatUserEditing.avatar_full = v.data
        }
      },
      programId (v) { if (v) this.init() },
    },
    created () {
      this.init()
    },
    methods: {
      ...mapActions({
        ProgramRead: 'company/program/read',
        ChatUserRead: 'chat/chatUser/read',
        updateChatUser: 'chat/chatUser/update',
        updateChat: 'company/program/updateChat',

      }),
      getEditFields (model) {
        const resObj = {}
        const fields = ['can_write', 'real_chat_name', 'chat_welcome']

        fields.forEach(field => { resObj[field] = model[field] })
        return resObj
      },
      async init () {
        try {
          this.ProgramReadAction = true
          await this.ProgramRead({ id: this.programId })
          await this.ChatUserRead(this.programId)
          this.programModelEditing = Object.copy(this.programModel)
          this.chatUserEditing = Object.copy(this.chatUser)
        } catch (e) {
          console.error(e)
        } finally {
          this.ProgramReadAction = false
        }
      },
      async cancelEdit () {
        try {
          if (this.hasChanges) {
            await this.$confirm(
              'Имеются не сохраненные изменения. Закрыть без сохранения?',
              'Настройка чатов компании',
              {
                confirmButtonText: 'Закрыть',
                cancelButtonText: 'Отмена',
                type: 'warning',
              })
          }
          this.$router.back()
        } catch (error) {

        }
      },
      async saveChanges () {
        try {
          this.saveAction = true

          if (this.hasChatUserChanges) {
            await this.updateChatUser({
              id: this.programId,
              name: this.chatUserEditing.name,
              avatar: this.smallImgBlob || this.chatUserEditing.avatar_full,
            })
          }

          if (this.hasProgramChanges) {
            await this.updateChat({
              programId: this.programId,
              canWrite: this.programModelEditing.can_write,
              realChatName: this.programModelEditing.real_chat_name,
              chatWelcome: this.programModelEditing.chat_welcome,
            })
          }

          this.$notify({
            title: 'Настройка чатов компании',
            text: this.hasModeratedChanges ? 'Изменения сохранены и отправлены на модерацию' : 'Изменения сохранены',
            type: 'success',
          })
        } catch (e) {
          console.error(e)
        } finally {
          this.saveAction = false
        }
      },
      uploadAvatar (e) {
        if (e.target.files[0]) {
          const file = e.target.files[0]

          validate(file, 'ext:jpg,png|size:10000')
            .then(result => {
              if (result.valid) {
                this.selectedImg = file
                this.cropperSmallDialog = true
                e.target.type = 'text'
                e.target.type = 'file'
                // const url = URL.createObjectURL(file)
                // this.chatUserEditing.avatar = url
                // console.log('file' ,file)
                // this.chatUserEditing.file = file
                // this.imgAvatar = { img_url: url, file: file }
              } else {
                this.$notify({
                  title: 'Фотография в чате',
                  text: 'Файл превышает 10Мб',
                  type: 'error',
                })
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

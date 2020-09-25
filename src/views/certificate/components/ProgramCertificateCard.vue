<template lang="">
  <v-container
    fluid
    class="program-cert-block"
  >
    <v-row>
      <v-col>
        <v-row>
          <v-col>
            <span class="program-cert-block__title body-l-semibold neutral-900--text">{{ name }}</span>
            <v-chip
              :class="{
                'cert-moderation-status': true,

                'moderation-status-ACCEPT': moderationStatus === 'ACCEPT',
                'moderation-status-REJECT': moderationStatus === 'REJECT',
                'moderation-status-TEMPLATE': moderationStatus === 'TEMPLATE',
              }"
            >
              {{ moderationStatusEnum[moderationStatus].name }}
            </v-chip>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="body-m-regular neutral-700--text">
            {{ description }}
          </v-col>
        </v-row>
        <v-row style="min-height: 60px">
          <v-col>
            <v-switch
              v-show="moderationActive"
              :input-value="internalActive"
              :loading="ChangeActiveAction"
              :class="{
                'program-cert-block_switch': true,
                'program-cert-block_switch-active': internalActive,
              }"
              hide-details
              @change="activeChange"
            >
              <span
                slot="label"
                class="program-cert-block_switch_label"
              >{{ internalActive ? 'Опубликован' : 'Не опубликован' }} {{ internalActive }}</span>
            </v-switch>
          </v-col>
        </v-row>
        <v-row
          class="program-cert-block_nominals"
          align="end"
        >
          <v-col>
            <v-chip
              v-for="(nominal, index) in nominals"
              :key="index"
              label
              close
              class="program-cert-nominal"
              @click:close="deleteNominal(nominal)"
            >
              {{ nominal.nominal_name }}
            </v-chip>
            <v-btn
              icon
              color="primary"
              small
              @click="addNominal()"
            >
              <v-icon style="width:21px; height:21px">
                $iconify_feather-plus-circle
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="auto">
        <v-row>
          <v-col>
            <v-icon
              color="neutral-500"
              @click="certMenuActive= !certMenuActive"
            >
              $iconify_feather-more-vertical
            </v-icon>
          </v-col>
        </v-row>
        <v-expand-transition>
          <v-row
            v-show="certMenuActive"
            no-gutters
          >
            <v-col>
              <v-row
                v-for="(itemMenu, index) in certMenuItems"
                :key="index"
              >
                <v-col>
                  <v-btn
                    icon
                    small
                    :loading="itemMenu.loadingAction"
                    @click="menuAction(itemMenu)"
                  >
                    <v-icon
                      color="neutral-500"
                      v-text="itemMenu.icon"
                    />
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-expand-transition>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    props: {
      id: {
        type: Number,
        required: true,
      },
      name: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
      active: {
        type: Boolean,
        default: false,
      },
      moderationActive: {
        type: Boolean,
        default: false,
      },
      moderationStatus: {
        type: String,
        default: 'TEMPLATE',
      },
      nominals: {
        type: Array,
        default: () => [],
      },
      program: {
        type: Object,
        required: true,
      },
    },
    constants: {
      moderationStatusEnum: {
        ACCEPT: {
          id: 'ACCEPT',
          name: 'Принят',
        },

        REJECT: {
          id: 'REJECT',
          name: 'Отклонен',
        },

        TEMPLATE: {
          id: 'TEMPLATE',
          name: 'На модерации',
        },
      },
    },
    data () {
      return {
        certMenuActive: false,
        ChangeActiveAction: false,
        localActive: !!this.active,
        certAction: true,
        certMenuItems:
          [
            { icon: '$iconify_feather-edit', action: this.editCert, loadingAction: false },
            { icon: '$iconify_ion-qr-code-outline', action: this.getQRCode, loadingAction: false },
            { icon: '$iconify_feather-copy', action: this.copyLinkCert, loadingAction: false },
            { icon: '$iconify_feather-trash', action: this.deleteCert, loadingAction: false },
          ],

      }
    },
    computed: {
      internalActive: {
        get () {
          return this.active
        },
        set (v) {
          // set active
          console.log('set internalActive', v)
          // if (v !== this.active)
          //  this.$emit('update:active', v)
        },
      },

      canCertPublish () {
        return this.moderationActive && this.program.active
      },
    },
    methods: {
      async menuAction (sender) {
        try {
          sender.loadingAction = true
          await sender.action()
        } catch (error) {
          console.error(error)
        } finally {
          console.log('loadingAction false')
          sender.loadingAction = false
        }
      },
      async editCert () {},
      async  getQRCode () {},
      async copyLinkCert () {},
      async deleteCertAction (force = false) {
        await this.$store.dispatch('certificates/certificate/DeleteCert', {
          id: this.id, force,
        })
        this.$notify({
          title: this.name,
          message: 'Сертификат успешно удален',
          type: 'success',
        })
      },
      async deleteCert () {
        // this.$store.dispatch('certificates/certificate/DeleteCert', {})
        try {
          await this.$confirm(
            `Вы уверены, что хотите удалить сертификат ${this.name} в корзину?`,
            'Удаление заказа сертификата в корзину',
            {
              confirmButtonText: 'Удалить',
              cancelButtonText: 'Отмена',
              type: 'warning',
            },
          )
        } catch {
          console.log('Cancel delete')
          return
        }

        try {
          await this.deleteCertAction(false)
        } catch (error) {
          if (
            error &&
            error.response &&
            error.response.data &&
            error.response.data.code === 101
          ) {
            await this.$confirm(
              'У ваших клиентов есть сертификат, который вы удаляете (в корзинах или выпущенные). Если вы удалите данный сертификат, клиенты не смогут его покупать, но те, сертификаты, которые уже помещены в корзину или выпущены продолжат действовать. Все равно удалить сертификат?',
              'Удаление сертификата',
              {
                confirmButtonText: 'Да',
                cancelButtonText: 'Отмена',
                type: 'warning',
              },
            )
            await this.deleteCertAction(true)
          }
        }

        // .then(() => {
        //   console.log('then confirm')
        // })
        // .catch(() => {
        //   console.log('Cancel delete')
        // })
      },

      deleteNominal (nominal) {
        console.log('deleteNominal')
      },
      addNominal () {
        // this.internalActive = !this.active
      },
      activeChange (value) {
        console.log('activeChange', value)

        // todo ChangeActive
        this.ChangeActiveAction = true
        this.$store.dispatch('certificates/certificate/ChangeActive', {
          id: this.id,
          active: value,
          program_id: this.program.id,
        }).then((res) => {
          // this.internalActive = !value
        }).catch(() => {
          console.log('this.active', this.active)
          this.$nextTick(() => {
            this.internalActive = this.active
          })
        }).finally(() => {
          this.ChangeActiveAction = false
        })
      },
    },

  }
</script>

<style lang="scss" scoped>
@import "@/styles/vuetify-preset-plus/light_theme/_variables.sass";
@import "@/styles/_typography";

.program-cert-block {
  // max-width: 502px;
  background: $neutral-100;
  border: 1px solid #F2F2F7;
  box-shadow: 0px 7px 20px rgba(88, 93, 106, 0.1);
  border-radius: 10px;
  background: #FFFFFF;
  padding: 0px 20px 0px 20px;

  .settings-block--content , .settings-block--chevron {
    margin-top: 2px;
  }
  .program-cert-block__title{
    margin-right: 20px;
  }
  .program-cert-block_switch{
    margin: 6px 0px;
    @include body-m-medium;
    .program-cert-block_switch_label {
      color: $neutral-600;
    }

    &.program-cert-block_switch-active{
      .program-cert-block_switch_label{
         color: $neutral-900;
      }

    }
  }

  .program-cert-block_nominals{
    min-height: 110px;
  }

  .program-cert-nominal{
    @include body-s-semibold;
    color: $primary-base;
    background-color: $primary-100;
    border-radius: 6px;
    margin: 4px;
    height: 37px;
  }

  .cert-moderation-status{
    @include body-xs-semibold;
    border-radius: 4px;

    &.moderation-status-ACCEPT {
      color: $success;
      background: rgba(0, 209, 93, 0.15);
    }

    &.moderation-status-REJECT {
      color: $error;
      background: rgba(234, 76, 42, 0.15);
    }

    &.moderation-status-TEMPLATE {
      color: $warning;
      background: rgba(255, 163, 56, 0.15);
    }
  }
}
</style>

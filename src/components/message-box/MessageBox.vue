<template>
  <v-dialog
    v-model="dialog"    
    :fullscreen="false"
    max-width="420"
  >
    <v-card>
      <v-toolbar>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            @click="handleClose()"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text>
        <v-container v-if="message">
          {{ message }}
        </v-container>
        <v-container v-else>
          <slot name="content" />
        </v-container>
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
          ref="cancel"
          text
          @click.native="handleAction('cancel')"
          @keydown.enter="handleAction('cancel')"
        >
          {{ cancelButtonText }}
        </v-btn>
        <v-spacer />
        <v-btn
          ref="confirm"
          color="primary"
          :loading="confirmAction"
          @click.native="handleAction('confirm')"
          @keydown.enter="handleAction('confirm')"
        >
          {{ confirmButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>

// import { events }    from './events'
  import { VDialog } from 'vuetify/lib'
  import vuetify from '@/plugins/vuetify'

  export default {
    vuetify,
    name: 'MessageBox',
    components: { VDialog },
    props: {
      type: {
        type: String,
        default: 'info',
      },
      title: {
        type: String,
        default: '',
      },
      message: {
        type: String,
        default: '',
      },
      cancelButtonText: {
        type: String,
        default: 'Отмена',
      },
      confirmButtonText: {
        type: String,
        default: 'ОК',
      },      
      closeOnHashChange: {
        type: Boolean,
        default: true,
      },

    },
    data () {
      return {
        uid: 1,
        action: '',
        confirmAction: false,        
        dialog: false,
      }
    },
    computed: {
      
    },
    watch: {
      dialog (val) {
        if (val) {
          this.uid++
          if (this.$type === 'alert' || this.$type === 'confirm') {
            this.$nextTick(() => {
              this.$refs.confirm.$el.focus()
            })
          }
          // this.focusAfterClosed = document.activeElement
          // messageBox = new Dialog(this.$el, this.focusAfterClosed, this.getFirstFocus())
        }

        // prompt
        // if (this.$type !== 'prompt') return
        // if (val) {
        //   setTimeout(() => {
        //     if (this.$refs.input && this.$refs.input.$el) {
        //       this.getInputElement().focus()
        //     }
        //   }, 500)
        // } else {
        //   this.editorErrorMessage = ''
        //   removeClass(this.getInputElement(), 'invalid')
        // }
      },
    },
    mounted () {
      console.log('msgbox mounted')
      this.$nextTick(() => {
        if (this.closeOnHashChange) {
          window.addEventListener('hashchange', this.close)
        }
      })
    },

    beforeDestroy () {
      if (this.closeOnHashChange) {
        window.removeEventListener('hashchange', this.close)
      }
      // setTimeout(() => {
      //   messageBox.closeDialog()
      // })
    },
    methods: {
      validate () {
        return true
      },
      getSafeClose () {
        const currentId = this.uid
        return () => {
          this.$nextTick(() => {
            if (currentId === this.uid) this.doClose()
          })
        }
      },
      doClose () {
        console.log('doClose')
        if (!this.dialog) return
        this.dialog = false

        this.onClose && this.onClose()

        // messageBox.closeDialog(); // 解绑
        // this.doAfterClose();
        setTimeout(() => {
          if (this.action) this.callback(this.action, this)
        })
      },
      handleWrapperClick () {
        if (this.closeOnClickModal) {
          this.handleAction(this.distinguishCancelAndClose ? 'close' : 'cancel')
        }
      },
      handleInputEnter () {
        if (this.inputType !== 'textarea') {
          return this.handleAction('confirm')
        }
      },
      handleAction (action) {
        console.log('handleAction', action)
        if (this.$type === 'prompt' && action === 'confirm' && !this.validate()) {
          return
        }
        this.action = action
        if (typeof this.beforeClose === 'function') {
          this.close = this.getSafeClose()
          this.beforeClose(action, this, this.close)
        } else {
          this.doClose()
        }
      },
      handleClose () {
        this.handleAction('close')
      },

    },
  }
</script>
<style lang="scss" scoped>
</style>

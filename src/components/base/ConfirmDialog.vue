<template>
  <v-dialog
    v-model="internalDialog"
    :activator="activator"
    max-width="420"
  >
    <template v-slot:activator="{ on }">
      <slot
        name="activator"
        :on="on"
      />
    </template>

    <v-card>
      <v-toolbar>
        <v-toolbar-title>{{ title }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            icon
            @click="close()"
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
          text
          @click="close()"
        >
          {{ cancelButtonText }}
        </v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          :loading="confirmAction"
          @click="clickHandle()"
        >
          {{ confirmButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  export default {
    name: 'ConfirmDialog',
    model: {
      prop: 'dialog',
      event: 'change',
    },
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

      dialog: Boolean,
      activator: {
        type: [String, Object, undefined],
        default: undefined,
      },

    },
    data () {
      return {
        result: 'cancel',
        confirmAction: false,
      }
    },
    computed: {
      internalDialog: {
        get () {
          return this.dialog
        },
        set (val) {
          if (val === this.dialog) return

          this.$emit('change', val)
          if (val === false) this.$emit('close', this.result)
        },
      },
    },
    methods: {
      close (result = 'cancel') {
        this.result = result
        this.internalDialog = false
      },      
      async clickHandle () { 
          
          this.close('confirm') 
          this.$emit('confirm')        
      },

    },
  }
</script>
<style lang="scss" scoped>
</style>

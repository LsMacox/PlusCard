<template>
  <v-row
    align="center"
    justify="center"
    style="height: 100%;"
  >
    <v-col cols="auto">
      <v-row justify="center">
        <v-col cols="auto">
          <slot name="image" />
        </v-col>
      </v-row>
      <v-row>
        <v-col style="width:502px">
          <v-row justify="center">
            <p class="title-s-bold">
              {{ title }}
            </p>
          </v-row>
          <v-row justify="center">
            <p
              class="body-m-regular"
              style="text-align:center;"
            >
              {{ description }}
              <slot name="description" />
            </p>
          </v-row>
          <v-row
            v-if="$slots.actions"
            justify="center"
            class="action-row"
          >
            <v-col>
              <slot name="actions" />
            </v-col>
          </v-row>
          <v-row
            v-else-if="action"
            justify="center"
            class="action-row"
          >
            <v-btn
              color="primary"
              @click="btnClick"
            >
              <v-icon
                v-if="actionIcon"
                left
              >
                {{ actionIcon }}
              </v-icon>
              {{ actionText }}
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

  export default {
    name: 'EmptyBlockPage',
    components: { },
    props: {
      title: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
      action: Boolean,
      actionIcon: {
        type: String,
        default: '',
      },
      actionText: {
        type: String,
        default: '',
      },

    },

    computed: {},
    methods: {
      btnClick () {
        this.$emit('action')
      },
    },
  }
</script>
<style lang="scss" scoped>
.action-row{
  margin-top: 14px;
}
</style>

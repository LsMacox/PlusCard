<template>
  <div class="master-field-block">
    <v-row>
      <v-col class="pb-0">
        <master-field-title :title="title" />
      </v-col>
    </v-row>
    <v-row v-if="horisontal">
      <v-col>
        <master-field-description>
          <slot name="description">
            {{ description }}
          </slot>
        </master-field-description>
      </v-col>
      <v-col>
        <slot name="input" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-row>
          <v-col>
            <master-field-description>
              <slot name="description">
                {{ description }}
              </slot>
            </master-field-description>
          </v-col>
        </v-row>
        <v-row>
          <v-col> <slot name="input" /></v-col>
        </v-row>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import MasterFieldTitle from './MasterFieldTitle'
  import MasterFieldDescription from './MasterFieldDescription'

  export default {
    name: 'MasterFieldBlock',
    components: { MasterFieldTitle, MasterFieldDescription },
    props: {
      horisontal: {
        type: Boolean,
        default: false,
      },
      title: {
        type: String,
        default: '',
      },
      description: {
        type: String,
        default: '',
      },
    },

    computed: {},
  }
</script>
<style lang="scss" scoped>
.master-field-block{
  margin-top: 68px;
}
</style>

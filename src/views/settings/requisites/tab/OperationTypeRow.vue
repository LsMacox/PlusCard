<template>
  <v-container class="pa-0">
    <v-row
      no-gutters
      style="margin: 0px -4px"
      align="center"
    >
      <v-col
        cols="auto"
        style="margin: 0px 4px"
      >
        <v-img
          height="21px"
          width="21px"
          size="9"
          :src="icon"
        />
      </v-col>
      <v-col style="margin: 0px 4px">
        <span :class="colorClass">
          {{ name }}
        </span>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { BALANCE_OPERATION_TYPE_ENUM } from '@/models/enums'

  export default {
    name: 'OperationTypeRow',
    props: {
      operationType: {
        type: String,
        required: true,
      },
    },
    computed: {
      operationEnum () {
        return BALANCE_OPERATION_TYPE_ENUM.find(this.operationType)
      },
      icon () {
        return this.operationEnum.icon
      },
      colorClass () {
        return `${this.operationEnum.color}--text`
      },
      name () {
        return this.operationEnum.text
      },

    },
  }
</script>

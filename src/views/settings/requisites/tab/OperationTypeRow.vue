<template>
  <v-container class="pa-0">
    <status-column
      :icon="icon"
      :text="name"
      :color="operationEnum.color"
    />
  </v-container>
</template>

<script>
  import { BALANCE_OPERATION_TYPE_ENUM } from '@/models/enums'

  export default {
    name: 'OperationTypeRow',
    components: {
      StatusColumn: () => import('@/components/colums/StatusColumn.vue'),
    },
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

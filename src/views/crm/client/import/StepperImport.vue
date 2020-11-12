<template>
  <div class="my-stepper-import">
    <step-one
      v-if="step === 1"
      :excel.sync="excel"
      :step.sync="step"
    />
    <step-two
      v-if="step === 2"
      :excel.sync="excel"
      :step.sync="step"
    />
    <step-three
      v-if="step === 3"
      :excel.sync="excel"
      :step.sync="step"
    />
  </div>
</template>

<script>
  import StepOne from '@/views/crm/client/import/StepOne'
  import StepTwo from '@/views/crm/client/import/StepTwo'
  import StepThree from '@/views/crm/client/import/StepThree'

  export default {
    components: {
      StepOne,
      StepTwo,
      StepThree,
    },
    data () {
      return {
        step: 1,
        steps: 3,
        excel: [],
      }
    },
    watch: {
      excel (v) {
        console.log(v)
      },
    },
  }
</script>

<style lang="scss" scoped>

</style>

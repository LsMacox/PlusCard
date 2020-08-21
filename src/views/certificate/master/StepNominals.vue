<template lang="">
  <v-container>
    StepNominals
            <v-row
              align="center"
              justify="center"
            >
              <div class="display-3">
                Step1
              </div>
               <v-btn
        color="success"
        @click="onNextClick"
      >
        next
      </v-btn>
            </v-row>
  </v-container>
</template>

<script>

  export default {
    data () {
      return {
        

      }
    },
    computed: {

    },
    methods: {
      onNextClick(){},
    },
    created () {
    
    },
  }
</script>

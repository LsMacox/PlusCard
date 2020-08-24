<template lang="">
  <v-container>
    
            <v-row
              align="center"
              justify="center"
            >
            StepRules
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
     onNextClick(){
        this.$emit('continue', true)
      },
    },
    created () {
    
    },
  }
</script>

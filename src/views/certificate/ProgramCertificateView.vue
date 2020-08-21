<template lang="">
  <div> {{program}} <v-btn  color="primary" dark >create</v-btn> </div>

</template>

<script>
  export default {
    data () {
      return {

      }
    },
    computed: {
      program () {
        return { id: 1 }
      },
    },
  }
</script>

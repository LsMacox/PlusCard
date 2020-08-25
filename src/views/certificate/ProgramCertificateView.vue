<template lang="">
  <div> {{program}} <v-btn  color="primary" dark @click="onMasterCreateCert" >Выпустить сертификат</v-btn> </div>


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
    methods: {
      onMasterCreateCert(){
        this.$router.push({name:'ProgramCertificateMaster'})
      },
      loadData(){
         this.GetCategoryListLoading = true
        this.$store
          .dispatch('certificates/certificate/GetCertList')
          .finally(() => {
            this.GetCategoryListLoading = false
          })
          
      }
    },
    mounted() {
      
    },
  }
</script>

<template>
  <div class="create-loyalty-toolbar">
    <div class="row">
      <div class="col-sm-4 col-md-2 col-lg-1">
        <v-btn
          color="secondary"
          :text="true"
          :ripple="false"
          class="btn-with-img"
          @click="$router.go(-1)"
        >
          <img src="@/icons/svg/arrowBack.svg">
          Назад
        </v-btn>
      </div>
      <div class="col-sm-8 col-md-10 col-lg-11 d-flex justify-center">
        <h3 class="title-tolbar">Создание программы лояльности</h3>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Toolbar',
  }
</script>

<style scoped>
  .title-tolbar {
    font-size: 17px;
  }
</style>

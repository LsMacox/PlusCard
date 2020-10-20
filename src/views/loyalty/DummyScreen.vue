<template>
  <div class="dummy-screen">
    <v-img
      class="dummy-screen-img"
      src="@//assets/png/loyalty-dummy.png"
    />
    <div class="dummy-screen-header title-s-bold">
      Здесь пока ничего нет :’(
    </div>
    <div class="dummy-screen-text body-m-regular">
      Здесь отображается информация по операциям програмы лояльности. По текущим настройкам фильтра или периода данных нет.
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="scss" scoped>
.dummy-screen {
  margin: 100px 0;

  .dummy-screen-img {
    margin: 0 auto;
    width: 186px;
    height: 156px;
  }

  .dummy-screen-header {
    margin: 34px auto 0 auto;
    max-width: 500px;
    text-align: center;
  }

  .dummy-screen-text {
    margin: 12px auto 0 auto;
    max-width: 500px;
    text-align: center;
  }
}
</style>

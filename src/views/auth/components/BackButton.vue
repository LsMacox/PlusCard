<template>
  <div
    class="button"
  >
    <v-img
      src="@/assets/svg/arrow-backward-outline-blue.svg"
      max-width="21px"
      max-height="21px"
      style="margin-right: 8px;"
    />
    <div class="text">
      Назад
    </div>
  </div>
</template>

<script>
  export default {

  }
</script>

<style lang="sass" scoped>
  .button
    display: flex
    align-items: center
    cursor: pointer

    .text
      font-style: normal
      font-size: 13px
      line-height: 17px
      font-weight: 600
      color: #4776E6
</style>

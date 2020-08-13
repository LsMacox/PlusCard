<template>
  <div id="master">
    <div class="app-bar">
      <v-row align="center" style="min-height: 100px">
        <v-col cols="2">
          <div class="nav-block">
              <v-icon class="nav-block__icon">mdi-arrow-left</v-icon>
              <span class="body-s-semibold nav-block__text">Назад</span>
          </div>
        </v-col>
        <v-col cols="10">
          <div class="stepper">
            <div class="stepper-block first-step body-l-semibold" :style="'color:' + currentStep == 1 ? '#8E54E9' : '#2A2A34'">
              Общая информация
            </div>
            <v-icon class="stepper__icon">mdi-chevron-right</v-icon>
            <div class="stepper-block second-step body-l-semibold" :style="'color:' + currentStep == 1 ? '#8E54E9' : '#2A2A34'">
              Точки продаж
            </div>
            <v-icon class="stepper__icon">mdi-chevron-right</v-icon>
            <div class="stepper-block third-step body-l-semibold">
              Контактные данные
            </div>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Master',
    components: {

    },
  }
</script>

<style lang="sass" scoped>
#master
  min-height: 100px
  .app-bar
    min-height: 100px
    .nav-block
      width: 84px
      padding-left: 20px
      &__icon, .nav-block__text
        color: #4776E6
    .stepper
      display: flex
      flex-direction: row
      justify-content: space-between
      max-width: 530px
      &__icon
        color: #D7D7E0

</style>

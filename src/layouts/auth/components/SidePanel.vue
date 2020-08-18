<template>
  <div class="side-panel">
    <v-img
      src="@/assets/svg/plus_logo_lg.svg"
      max-width="113px"
      max-height="47px"
      class="side-panel-logo"
    />
    <div
      class="side-panel-empty"
    />
    <div
      class="side-panel-carousel"
    >
      <div
        v-for="(item, i) in offers"
        :key="i"
        class="side-panel-carousel-text"
      >
        {{ item.text }}
      </div>
      <div
        class="side-panel-carousel-control"
      >
        <div
          :class="getControlClass(0)"
          @click="activeOffer = 0"
        />
        <div
          :class="getControlClass(1)"
          @click="activeOffer = 1"
        />
        <div
          :class="getControlClass(2)"
          @click="activeOffer = 2"
        />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: () => ({
      activeOffer: 0,
      offers: [
        { img: null, text: 'Создавайте программы лояльности' },
        { img: null, text: 'Выпускайте подарочные сертификаты' },
        { img: null, text: 'Управляйте несколькими своими компаниями' },
      ],
    }),
    methods: {
      getControlClass () {
        // side-panel-carousel-control-item active
      },
    },
  }
</script>

<style lang="sass" scoped>
  .side-panel
    display: flex
    flex-direction: column
    width: 340px
    height: 100vh
    overflow-y: auto
    background: #EBF1FF

    .side-panel-logo
      flex: 0 0 auto
      margin: 48px auto 0 auto

    .side-panel-empty
      flex: 1 0 auto

    .side-panel-carousel
      flex: 0 0 auto
      text-align: center

      .side-panel-carousel-text
        font-size: 20px
        line-height: 24px
        font-style: normal
        font-weight: bold
        color: #2A2A34

      .side-panel-carousel-control
        display: flex
        align-items: center
        justify-content: center
        margin: 46px 0

        .side-panel-carousel-control-item
          margin: 2px
          width: 4px
          height: 4px
          border-radius: 10px
          background-color: #D7D7E0
          cursor: pointer

        .active
          width: 6px
          height: 6px
          background-color: #4776E6
</style>

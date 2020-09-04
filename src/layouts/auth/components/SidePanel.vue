<template>
  <div
    class="side-panel"
  >
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
      >
        <v-img
          v-show="activeOffer === i"
          :src="item.img"
          style="width: 213px; height: 172px; margin: 25px auto;"
          eager
        />
      </div>
      <div
        class="side-panel-carousel-text"
        v-html="offerText"
      />
      <div
        class="side-panel-carousel-control"
      >
        <div
          v-for="(item, i) in offers"
          :key="i"
          :class="getControlClass(i)"
          @click="getOffer(i)"
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
        { img: require('@/assets/png/auth-side-panel-img1.png'), text: 'Создавайте программы<br>лояльности' },
        { img: require('@/assets/png/auth-side-panel-img2.png'), text: 'Выпускайте подарочные<br>сертификаты' },
        { img: require('@/assets/png/auth-side-panel-img3.png'), text: 'Управляйте несколькими<br>своими компаниями' },
      ],
      timerId: null,
    }),
    computed: {
      // eslint-disable-next-line vue/return-in-computed-property
      offerText () {
        //
        const offer = this.offers.filter((item, i) => i === this.activeOffer)
        if (offer.length) return offer[0].text
        return null
      },
    },
    mounted () {
      this.timerId = setInterval(() => this.offerRotate(), 5000)
    },
    methods: {
      getControlClass (index) {
        if (index === this.activeOffer) return 'side-panel-carousel-control-item active'
        return 'side-panel-carousel-control-item'
      },
      offerRotate () {
        const count = this.offers.length
        if ((this.activeOffer + 1) === count) this.activeOffer = 0
        else this.activeOffer++
      },
      getOffer (index) {
        clearInterval(this.timerId)
        this.activeOffer = index
      },
    },
  }
</script>

<style lang="scss" scoped>
  .side-panel {
    display: flex;
    flex-direction: column;
    width: 340px;
    height: 100vh;
    overflow-y: auto;
    background: #EBF1FF;
    @media(max-width: 776px) {
      display: none;
    }

    .side-panel-logo {
      flex: 0 0 auto;
      margin: 48px auto 0 auto;
    }

    .side-panel-empty {
      flex: 1 0 auto;
    }

    .side-panel-carousel {
      flex: 0 0 auto;
      text-align: center;

      .side-panel-carousel-text {
        font-size: 20px;
        line-height: 24px;
        font-style: normal;
        font-weight: bold;
        color: #2A2A34;
      }

      .side-panel-carousel-control {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 46px 0;

        .side-panel-carousel-control-item {
          margin: 2px;
          width: 4px;
          height: 4px;
          border-radius: 10px;
          background-color: #D7D7E0;
          cursor: pointer;
        }

        .active {
          width: 6px;
          height: 6px;
          background-color: #4776E6;
        }
      }
    }
  }
</style>

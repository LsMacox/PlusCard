<template>
  <div class="auth-content-box">
    <v-row>
      <v-col class="body-s-semibold neutral-500--text">
        Продолжить работу:
      </v-col>
    </v-row>

    <v-row>
      <v-list class="merchant-select-box app__scroll-y" >
        <v-list-item
          v-for="(item, i) in merchants"
          :key="i"
          class="merchant-select-item"
          @click="$emit('select', item.id)"
        >
          <v-list-item-icon class="merchant-select-item__icon">
            <v-btn
              class="merchant-logo-btn"
              color="primary"
              fab
            >
              <span class="body-l-semibold">{{ getFirstChar(item.name) }}</span>
            </v-btn>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title
              class="body-l-semibold"
              color="neutral-900"
              v-text="item.name"
            />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-row>

    <!-- <div class="merchant-select-box app__scroll-y">
      <div
        v-for="(item, i) in merchants"
        :key="i"
        class="merchant-select-block"
        @click="$emit('select', item.id)"
      >
        <v-img
          src="@/assets/svg/plus_logo_sm.svg"
          max-width="46px"
          height="46px"
        />
        <div class="merchant-select-block-text">
          {{ item.name }}
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>

  export default {
    components: { },
    props: {
      merchants: {
        type: Array,
        required: true,
      },
    },

    data () {
      return {

      }
    },
    computed: {

    },
    mounted () {

    },
    methods: {
      getFirstChar (str) {
        return str && str.slice(0, 1)
      },

    },
  }
</script>

<style lang="scss" scoped>
@import "~@/styles/auth";

.merchant-select {
  .merchant-select-item {
    .merchant-select-item__icon{
      margin-right: 16px;
      margin-top: 10px;
      margin-left: 10px;
    }
  }
}

</style>

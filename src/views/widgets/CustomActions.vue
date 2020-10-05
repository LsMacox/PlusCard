<template>
  <tab-list-frame
    class="custom-actions"
    :tabs="['Активность', 'Покупки']"
  >
    <template v-slot:tab-1>
      <ul class="custom-actions__list">
        <li
          v-for="item in widgetData"
          :key="item.id"
          class="custom-actions__item"
        >
          <div class="custom-actions__item-img">
            <img
                style="width: 24px; border-radius: 50%;"
                :src="item.avatar"
            >
          </div>
          <div class="custom-actions__item-text">
            <p class="body-s-semibold">
              {{ item.name }} {{ item.lastname }}
            </p>
            <span class="body-s-medium wc-neutral">{{ item.action_count }} действия</span>
          </div>
        </li>
      </ul>
    </template>
    <template v-slot:tab-2 />
  </tab-list-frame>
</template>

<script>
  import TabListFrame from '@/views/widgets/frames/TabListFrame'
  import WidgetFunctions from '@/views/widgets/mixins/WidgetFunctions.js'

  export default {
    components: { TabListFrame },
    mixins: [WidgetFunctions],
    props: {
      widgetData: {
        type: Array,
        default () {
          return []
        },
      },
    },
    data () {
      return {
      }
    },
    computed: {
    },
    methods: {},
  }
</script>

<style lang="scss" scoped>

@import "@/styles/vuetify-preset-plus/light_theme/widgets/_custom-actions.scss";

</style>

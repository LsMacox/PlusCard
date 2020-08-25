<template>
  <v-form>
    <v-container>
      <v-row
        no-gutters
      >
        <v-col
          cols="6"
          style="padding-right: 20px"
        >
          <v-text-field
            outlined
            placeholder="Поиск операций, валют, клиентов"
          >
            <template v-slot:prepend-inner>
              <span
                class="iconify"
                data-icon="ant-design:search-outlined"
                data-inline="false"
              />
            </template>
          </v-text-field>
        </v-col>

        <v-col
          cols="5"
          style="padding-right: 20px"
        >
          <v-select
            outlined
            placeholder="Бонусная операция"
          />
        </v-col>

        <v-col cols="1">
          <v-chip
            class="advanced-filter"
          >
            <span
              class="iconify"
              data-icon="fa:sliders"
              data-inline="false"
            />
            <span>
              Все фильтры
            </span>
          </v-chip>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
  export default {
    props: {
    },
    data () {
      return {
      }
    },
    methods: {

    },
  }
</script>

<style lang="sass" scoped>
.advanced-filter
  //font-style: normal
  //font-weight: 600
  //font-size: 13px
  //line-height: 17px
  color: #4776E6
  cursor: pointer
</style>

<template>
  <div class="crm b-segment">
    <div class="crm__header b-segment__header">
      <p class="crm__header-title title-m-bold neutral-900--text">
        {{ program.name }}
      </p>
      <v-btn
        class="crm__header_new-btn"
        color="primary"
        @click="sidePanelCategoryStatus = true"
      >
        <iconify-icon
          icon="plus-circle"
          width="21"
        />
        <p
          class="body-m-semibold neutral-100--text"
        >
          категории
        </p>
      </v-btn>
      <v-btn
        class="crm__header_new-btn"
        color="primary"
        @click="sidePanelNewClientStatus = true"
      >
        <iconify-icon
          icon="plus-circle"
          width="21"
        />
        <p
          class="body-m-semibold neutral-100--text"
        >
          Новый клиент
        </p>
      </v-btn>
    </div>
    <div style="margin-top: 34px;">
      <div class="body-l-semibold neutral-900--text">
        Работа с клиентами
      </div>
      <div class="body-m-regular neutral-700--text">
        Для списания или начисления бонусов найдите клиента используя поле ниже. Вводите любые данные клиента: ФИО, номер карты, штрих-код, электронная почта, номер телефона.
      </div>
    </div>
    <client-table />
    <side-panel-new-client
      v-if="sidePanelNewClientStatus"
      v-model="sidePanelNewClientStatus"
    />
    <extended-category-side-panel
      v-model="sidePanelCategoryStatus"
      :categories="testSidePanelCategories"
      title="Ассортимент"
      sub-title="Выберите товары или категории товаров, на которые будет действовать акция."
      @updateCategories="testCreateCategories"
    />
  </div>
</template>

<script>
  import ClientTable from './Table'
  import SidePanelNewClient from './components/SidePanelNewClient'

  export default {
    components: {
      ClientTable,
      SidePanelNewClient,
    },
    data () {
      return {
        sidePanelNewClientStatus: false,
        sidePanelCategoryStatus: false,
        testSidePanelCategories: [
          {
            id: 1,
            name: 'Гравийный',
            categories: [
              {
                id: 2,
                name: 'Карбон',
                categories: [
                  { id: 1, name: 'Бренды', select: true, categories: [] },
                  {
                    id: 2,
                    name: 'Навесное оборудование',
                    categories: [
                      { id: 1, name: 'Shimano', categories: [] },
                      { id: 2, name: 'SRAM', categories: [] },
                    ],
                  },
                  { id: 3, name: 'Диметр колес', categories: [] },
                ],
              },
              {
                id: 1,
                name: 'Алюминий + карбон',
                categories: [
                  { id: 1, name: 'Бренды', categories: [] },
                  {
                    id: 2,
                    name: 'Навесное оборудование',
                    categories: [
                      { id: 1, name: 'Shimano', categories: [] },
                      { id: 2, name: 'SRAM', categories: [] },
                    ],
                  },
                  { id: 3, name: 'Диметр колес', categories: [] },
                ],
              },
              {
                id: 2,
                name: 'Сталь',
                categories: [
                  { id: 1, name: 'Бренды', categories: [] },
                  {
                    id: 2,
                    name: 'Навесное оборудование',
                    categories: [
                      { id: 1, name: 'Shimano', categories: [] },
                      { id: 2, name: 'SRAM', categories: [] },
                    ],
                  },
                  { id: 3, name: 'Диметр колес', categories: [] },
                ],
              },
              {
                id: 3,
                name: 'Алюминий',
                categories: [
                  { id: 1, name: 'Бренды', categories: [] },
                  {
                    id: 2,
                    name: 'Навесное оборудование',
                    categories: [
                      { id: 1, name: 'Shimano', categories: [] },
                      { id: 2, name: 'SRAM', categories: [] },
                    ],
                  },
                  { id: 3, name: 'Диметр колес', categories: [] },
                ],
              },
            ],
          },
          { id: 1, name: 'Шоссе' },
          { id: 1, name: 'Туринг' },
          { id: 1, name: 'MTB хардтейл' },
          { id: 1, name: 'MTB двухподвес' },
        ],
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
    },
    watch: {},
    created () {},
    mounted () {},
    methods: {
      testCreateCategories (v) {
        console.log('create categories bitch!!!', v)
      },
    },
  }
</script>

<style lang="scss">
  @import "@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";
</style>

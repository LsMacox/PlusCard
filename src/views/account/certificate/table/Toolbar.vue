<template>
  <!--  <v-sheet-->
  <!--      height="400"-->
  <!--      class="overflow-hidden"-->
  <!--      style="position: relative;"-->
  <!--  >-->
  <v-form>
    <v-container>
      <v-row
        no-gutters
      >
        <v-col
          cols="3"
          style="padding-right: 20px"
        >
          <v-text-field
            outlined
            placeholder="Поиск сертификатов, клиентов"
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
          cols="2"
          style="padding-right: 20px"
        >
          <v-select
            outlined
            placeholder="Статус оплаты"
          />
        </v-col>

        <v-col
          cols="2"
          style="padding-right: 20px"
        >
          <v-select
            outlined
            placeholder="Статус выплаты"
          />
        </v-col>

        <v-col
          cols="3"
          style="padding-right: 20px"
        >
          <v-select
            outlined
            placeholder="Статус сертификата"
          />
        </v-col>

        <v-col cols="2">
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

<!--    <v-navigation-drawer-->
<!--        v-model="drawer"-->
<!--        absolute-->
<!--        right-->
<!--        temporary-->
<!--    >-->
<!--      Фильтры-->
<!--&lt;!&ndash;      <v-list-item>&ndash;&gt;-->
<!--&lt;!&ndash;        <v-list-item-avatar>&ndash;&gt;-->
<!--&lt;!&ndash;          <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>&ndash;&gt;-->
<!--&lt;!&ndash;        </v-list-item-avatar>&ndash;&gt;-->

<!--&lt;!&ndash;        <v-list-item-content>&ndash;&gt;-->
<!--&lt;!&ndash;          <v-list-item-title>John Leider</v-list-item-title>&ndash;&gt;-->
<!--&lt;!&ndash;        </v-list-item-content>&ndash;&gt;-->
<!--&lt;!&ndash;      </v-list-item>&ndash;&gt;-->

<!--&lt;!&ndash;      <v-divider></v-divider>&ndash;&gt;-->

<!--&lt;!&ndash;      <v-list dense>&ndash;&gt;-->

<!--&lt;!&ndash;        <v-list-item&ndash;&gt;-->
<!--&lt;!&ndash;            v-for="item in items"&ndash;&gt;-->
<!--&lt;!&ndash;            :key="item.title"&ndash;&gt;-->
<!--&lt;!&ndash;            link&ndash;&gt;-->
<!--&lt;!&ndash;        >&ndash;&gt;-->
<!--&lt;!&ndash;          <v-list-item-icon>&ndash;&gt;-->
<!--&lt;!&ndash;            <v-icon>{{ item.icon }}</v-icon>&ndash;&gt;-->
<!--&lt;!&ndash;          </v-list-item-icon>&ndash;&gt;-->

<!--&lt;!&ndash;          <v-list-item-content>&ndash;&gt;-->
<!--&lt;!&ndash;            <v-list-item-title>{{ item.title }}</v-list-item-title>&ndash;&gt;-->
<!--&lt;!&ndash;          </v-list-item-content>&ndash;&gt;-->
<!--&lt;!&ndash;        </v-list-item>&ndash;&gt;-->
<!--&lt;!&ndash;      </v-list>&ndash;&gt;-->
<!--    </v-navigation-drawer>-->
<!--  </v-sheet>-->
</template>

<script>
  export default {
    name: 'Toolbar',
    props: {
      pSearchText: String,
      pCPS: Object, // certPaymentStatusEnum
    },
    data () {
      return {
        drawer: null,
        items: [
          { title: 'Home', icon: 'dashboard' },
          { title: 'About', icon: 'question_answer' },
        ],
      }
    },
    methods: {
      filters () {
        console.log('all filters...')
      },
    },
  }
</script>

<style scoped>

</style>

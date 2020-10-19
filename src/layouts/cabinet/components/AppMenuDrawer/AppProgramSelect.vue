<template>
  <div>
    <v-btn
      v-if="!drawer && programs && !programs.length"
      block
      color="secondary"
      style="margin: 10px; min-width: calc(100% - 20px) !important;"
      @click="goToMaster()"
    >
      Добавить компанию
    </v-btn>
    <v-btn
      v-if="drawer && programs && !programs.length"
      fab
      color="secondary"
      style="margin: 10px 7px;"
      @click="goToMaster()"
    >
      <v-icon>$iconify_eva-plus-outline</v-icon>
    </v-btn>
    <v-row
      v-if="programs && programs.length > 0"
      id="app-program-select-row"
      no-gutters
    >
      <v-col class="justify">
        <v-menu
          v-model="expandProgramList"
          content-class="app-program-select-menu"
          top
          offset-x
          offset-y
          z-index="500"
        >
          <template v-slot:activator="{ on}">
            <v-list>
              <v-list-item
                class="program-select"
                v-on="on"
              >
                <v-list-item-icon v-if="mini">
                  <v-btn
                    id="program-logo-btn"
                    color="primary"
                    fab
                    small
                  >
                    {{ selectedCompanyMini }}
                  </v-btn>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title
                    class="body-l-semibold"
                    color="neutral-900"
                    v-text="program.name"
                  />
                </v-list-item-content>

                <v-list-item-icon>
                  <v-icon
                    color="primary"
                    size="15"
                    v-text="expandProgramList? 'fas fa-chevron-up': 'fas fa-chevron-down'"
                  />
                </v-list-item-icon>
              </v-list-item>
            </v-list>
          </template>

          <v-list

            class="overflow-y-auto"
            style="max-height: 300px"
          >
            <v-list-item
              v-for="(item, index) in programs"
              :key="index"
              @click="changeCompany(item)"
            >
              <v-list-item-title
                class="body-l-semibold"
                color="neutral-900"
              >
                {{ item.name }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-btn
                block
                color="secondary"
                @click="goToMaster()"
              >
                Добавить компанию
              </v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
  </div>
</template>

<script>

  export default {
    name: 'AppProgramSelect',
    props: {
      mini: Boolean,
    },
    data: () => ({
      expandProgramList: false,
    }),
    computed: {
      drawer () {
        return this.$store.getters.drawer
      },
      bgcolor1 () {
        return this.program.bgcolor1 ? this.program.bgcolor1 : '#000000'
      },
      bgcolor2 () {
        return this.program.bgcolor2 ? this.program.bgcolor2 : '#eaeaea'
      },
      selectedCompanyMini () {
        return this.program && this.program.name.slice(0, 1)
      },
      profile () {
        return this.$store.getters['profile/profile/profile']
      },
      programs () {
        return this.$store.getters['company/program/programs'].filter(
          (item) => item.id !== this.program.id,
        )
      },
      program: {
        get () {
          return this.$store.getters['company/program/program']
        },
        set (v) {
          this.$store.commit('widget/filter/RESET_FILTER') // сброс фильтра бонусных операций
          this.$store.commit('company/program/SET_PROGRAM', v)
        },
      },
    },
    mounted () {},
    methods: {
      goToHelp () {
        this.$router.push({ name: 'Help' })
      },
      setExpandProgramList () {
        this.expandProgramList = !this.expandProgramList
      },
      goToMaster () {
        this.$router.push('/master')
        // this.$refs.programListGroup.click()
      },
      changeCompany (item) {
        this.program = Object.assign({}, item)
        // this.$refs.programListGroup.click()
      },
    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/_typography";

#program-logo-btn {
  @include body-l-semibold;
  height: 36px;
  width: 36px;
  margin-left: -8px;
}

.program-select,
.main-logo-row {
  padding-left: 20px;
  padding-right: 20px;

}

.main-logo-row,
.main-logo-row-mini {
  margin-top: 34px;
  margin-bottom: 34px;
}

.main-logo-row-mini {
  padding-left: 14px;
  padding-right: 14px;
}

.program-select {

    &:focus::before,
    &:hover::before {
      opacity: 0;
    }

}

#vApp {
  .app-program-select-menu {
  border-radius:  0px 12px 12px 0px !important;
  }
}
</style>

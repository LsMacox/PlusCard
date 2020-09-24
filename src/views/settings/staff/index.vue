<template>
  <div>
    <!-- TOOLBAR -->
    <v-row no-gutters>
      <v-col>
        <span class="title-m-bold neutral-900--text">Настройка сотрудников</span>
      </v-col>
      <v-col style="text-align: right;">
        <v-btn
          color="primary"
          @click="sidePanelActive = true"
        >
          <v-icon left>
            $iconify_plus-circle-outlined
          </v-icon> Добавить сотрудника
        </v-btn>
      </v-col>
    </v-row>

    <!-- TABLE -->
    <v-row>
      <v-col
        cols="12"
        style="width: 1024px"
      >
        <v-data-table
          :headers="headers"
          :items="tableData"
          :options="tableOptions"
          :single-expand="true"
          :expanded.sync="expanded"
          item-key="id"
          show-expand
          class="plus-table"
          hide-default-footer
        >
          <template v-slot:expanded-item="{ Headers, item }">
            <td :colspan="headers.length">
              More info about {{ item.id }}
            </td>
          </template>

          <template v-slot:item.data-table-expand="{ expand, isExpanded }">
            <v-icon
              color="neutral-500"
              style="width: 16px;"
              @click="expand(!isExpanded)"
            >
              $iconify_ion-close
            </v-icon>
          </template>

          <template v-slot:item.name="{ item }">
            <div class="cell-avatar">
              <div style="display: inline-block;">
                <v-img
                  :src="item.avatar"
                  class="avatar"
                />
              </div>
              <div class="cell-text">
                {{ item.name ? item.name : '-' }}
              </div>
            </div>
          </template>

          <template v-slot:item.phone="{ item }">
            <div class="cell-text">
              {{ item.phone ? item.phone : '-' }}
            </div>
          </template>

          <template v-slot:item.email="{ item }">
            <div class="cell-text">
              {{ item.email ? item.email : '-' }}
            </div>
          </template>

          <template v-slot:item.team_name="{ item }">
            <div class="cell-text">
              {{ item.team_name }}
            </div>
          </template>

          <template v-slot:item.role_name="{ item }">
            <div
              v-if="!inRoles(item.role_id)"
              class="cell-text-bold"
            >
              {{ item.role_name }}
            </div>

            <role-select
              v-else
              min-width="260px"
              :items="roles"
              :model.sync="item.role_id"
              item-value="id"
              item-label="display_name"
            />
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <!-- PAGINATION -->
    <v-row
      align="center"
      class="pagination"
    >
      <v-col>
        <div class="table-pagination-block">
          <div
            style="margin-right: 20px;"
          >
            Всего {{ totalCount }} {{ getWord(totalCount, wordStaff) }} на {{ pagesCount }} {{ getWord(pagesCount, wordPages) }}
          </div>

          <select-page-limit
            min-width="200px"
            :items="paginationOptions"
            :model.sync="tableOptions.itemsPerPage"
            item-value="value"
            item-label="text"
          />

          <div class="app__spacer" />

          <div class="text-center">
            <v-pagination
              v-model="tableOptions.page"
              next-icon="fas fa-chevron-right"
              prev-icon="fas fa-chevron-left"
              :length="pagesCount"
              :total-visible="7"
              circle
            />
          </div>
        </div>
      </v-col>
    </v-row>

    <side-panel
      v-model="sidePanelActive"
      :width="483"
      class="staff-side-panel"
    >
      <div class="staff-side-panel__header title-m-bold">
        Добавить сотрудника
      </div>
      <div class="staff-side-panel__text-block">
        <div class="staff-side-panel__text-block-header body-l-semibold">
          Отправка приглашения
        </div>
        <div class="body-m-regular">
          Пригласите сотрудника используя его почту или телефон. Выбранный способ будет использоваться для регистрации и дальнейшего входа в систему.
        </div>
      </div>

      <div style="margin: 18px 34px 0 34px;">
        <v-radio-group
          v-model="form.method"
          row
        >
          <v-radio
            label="Почта"
            value="email"
          />
          <v-radio
            label="Телефон"
            value="phone"
          />
        </v-radio-group>

        <v-text-field
          v-model="form.login"
          :placeholder="form.method === 'email' ? 'Введите почту сотрудника' : 'Введите телефон сотрудника'"
          class="auth-text-field"
          outlined
          required
          validate-on-blur
        />
      </div>

      <div
        class="staff-side-panel__text-block"
        style="margin: 4px 34px 0 34px;"
      >
        <div class="staff-side-panel__text-block-header body-l-semibold">
          Роль сотрудника
        </div>
        <div class="body-m-regular">
          Выберите роль сотрудника. От нее зависит доступ к информации и функционалу системы.
        </div>
      </div>

      <div style="margin: 34px 34px 0 34px;">
        <v-select
          v-model="form.role_id"
          :items="roles"
          placeholder="Выберите роль сотрудника"
          item-text="display_name"
          item-value="id"
          outlined
        />

        <v-btn
          style="margin-top: 26px;"
          color="primary"
          @click="inviteStaff()"
        >
          <v-icon left>
            $iconify_plus-circle-outlined
          </v-icon> Добавить сотрудника
        </v-btn>
      </div>
    </side-panel>
  </div>
</template>

<script>
  import SidePanel from '@/components/base/SidePanel.vue'
  import RoleSelect from '@/components/dialogs/RoleSelect'
  import SelectPageLimit from '@/components/dialogs/SelectPageLimit'

  export default {
    components: {
      SidePanel,
      RoleSelect,
      SelectPageLimit,
    },
    data () {
      return {
        loading: false,
        sidePanelActive: false,
        form: {
          method: 'email',
          login: null,
          role_id: null,
        },
        tableOptions: {
          page: 1,
          itemsPerPage: 25,
        },
        paginationOptions: [
          { text: '25 на странице', value: 25 },
          { text: '50 на странице', value: 50 },
          { text: '100 на странице', value: 100 },
          { text: '150 на странице', value: 150 },
          { text: '250 на странице', value: 250 },
          { text: '500 на странице', value: 500 },
        ],
        expanded: [],
        headers: [
          {
            text: 'Сотрудник',
            align: 'start',
            value: 'name',
          },
          {
            text: 'Телефон',
            value: 'phone',
          },
          {
            text: 'Почта',
            value: 'email',
          },
          {
            text: 'Команда',
            value: 'team_name',
          },
          {
            text: 'Роль',
            value: 'role_name',
          },
          { text: '', value: 'data-table-expand' },
        ],
        wordStaff: ['сотрудник', 'сотрудника', 'сотрудников'],
        wordPages: ['странице', 'страницах', 'страницах'],
      }
    },
    computed: {
      defaultForm () {
        return {
          method: 'email',
          login: null,
          role_id: null,
        }
      },
      program () {
        return this.$store.getters['company/program/program']
      },
      roles () {
        return this.$store.getters['company/staff/roles'].sort((a, b) => (a.id - b.id))
      },
      tableData () {
        return this.$store.getters['company/staff/staff']
      },
      totalCount () {
        return this.tableData.length
      },
      pagesCount () {
        const count = Math.ceil(this.totalCount / this.tableOptions.itemsPerPage)
        if (count) {
          if (this.tableOptions.page > count) {
            this.tableOptions.page = count
          }
          return count
        }
        this.tableOptions.page = 1
        return 1
      },
    },
    watch: {
      program (v) {
        if (v) this.fetchData()
      },
      'tableOptions.page' (v) {
        if (v) this.fetchData()
      },
      'tableOptions.itemsPerPage' (v) {
        if (v) this.fetchData()
      },
      sidePanelActive (v) {
        if (!v) {
          this.form = JSON.parse(JSON.stringify(this.defaultForm))
        }
      },
    },
    created () {
      this.fetchData()
    },
    methods: {
      inRoles (id) {
        const role = this.roles.find(item => item.id === id)
        if (role) return true
        return false
      },
      getWord (number, words) {
        const cases = [2, 0, 1, 1, 1, 2]
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
      },
      fetchData () {
        try {
          this.loading = true
          this.$store.dispatch('company/staff/roles')
          this.$store.dispatch('company/staff/list')
        } finally {
          this.loading = false
        }
      },
      inviteStaff () {
        console.log(this.form)
      },
    },
  }
</script>

<style lang="scss" scoped>
.cell-text {
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 17px;
  color: #2A2A34;
}

.cell-text-bold {
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 17px;
  color: #2A2A34;
}

.cell-hint {
  margin-top: 4px;
  font-style: normal;
  font-weight: 600;
  font-size: 11px;
  line-height: 14px;
  color: #9191A1;
}

.cell-avatar {
  display: flex;
  align-items: center;

  .avatar {
    margin-right: 8px;
    width: 25px;
    height: 25px;
    border-radius: 25px;
  }
}

.table-pagination-block {
  display: flex;
  align-items: center;

  .table-pagination-block-select {
    position: relative;
    top: 6px;
    left: 20px;
    width: 250px;
  }
}

.staff-side-panel {

  .staff-side-panel__header {
    margin: 50px 34px 0 34px;
  }

  .staff-side-panel__text-block {
    margin: 34px 34px 0 34px;

    staff-side-panel__text-block-header {
      margin-bottom: 6px;
    }
  }

}
</style>

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
          item-key="id"
          class="plus-table"
          hide-default-footer
        >
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

          <template v-slot:item.role_display_name="{ item }">
            <div
              v-if="!inRoles(item.role_id)"
              class="cell-text-bold"
            >
              {{ item.role_display_name }}
            </div>

            <role-select
              class="role__select"
              v-else
              min-width="260px"
              :items="roles"
              :model.sync="item.role_id"
              item-value="id"
              item-label="display_name"
              @changerole="updateRole(item)"
            />
          </template>

          <template v-slot:item.action="{ item }">
            <div class="cell-text">
              <v-icon
                v-if="item.role_name !== 'merchant-owner'"
                color="neutral-500"
                @click="deleteStaff(item)"
              >
                $iconify_ion-close
              </v-icon>
            </div>
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
      <v-form
        ref="staffForm"
        v-model="formValid"
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
            v-if="form.method === 'email'"
            key="email"
            v-model="form.email"
            placeholder="Введите почту сотрудника"
            outlined
            required
            validate-on-blur
            :rules="emailRules"
          />
          <v-text-field
            v-else
            key="phone"
            v-model="form.phone"
            v-mask="'+7 (###) ###-##-##'"
            placeholder="Введите телефон сотрудника"
            outlined
            required
            validate-on-blur
            :rules="phoneRules"
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
            :rules="[ v=> !!v || 'Выберите роль сотрудника' ]"
            outlined
          />

          <v-btn
            style="margin-top: 26px;"
            color="primary"
            :loading="loadingCreate"
            :disabled="!formValid"
            @click="inviteStaff()"
          >
            <v-icon left>
              $iconify_plus-circle-outlined
            </v-icon>
            Добавить сотрудника
          </v-btn>
        </div>
      </v-form>
    </side-panel>
  </div>
</template>

<script>
  import { mask } from 'vue-the-mask'
  import { emailV } from '@/plugins/validate-rules'
  import SidePanel from '@/components/base/SidePanel.vue'
  import RoleSelect from '@/components/dialogs/RoleSelect'
  import SelectPageLimit from '@/components/dialogs/SelectPageLimit'

  import {validPhone} from '@/utils/validate'

  export default {
    components: {
      SidePanel,
      RoleSelect,
      SelectPageLimit,
    },
    directives: { mask },
    data () {
      return {
        loading: false,
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
            text: 'Роль',
            value: 'role_display_name',
            width: '200px',
          },
          {
            text: '',
            value: 'action',
          },
        ],
        wordStaff: ['сотрудник', 'сотрудника', 'сотрудников'],
        wordPages: ['странице', 'страницах', 'страницах'],
        // side panel
        sidePanelActive: false,
        loadingCreate: false,
        loadingUpdate: false,
        loadingDelete: false,
        formValid: false,
        form: {
          method: 'email',
          email: null,
          phone: null,
          role_id: null,
        },
        phoneRules: [
          v => !!v || 'Телефон обязателен',
          v => validPhone(v) || 'Не верный формат'
        ],
        emailRules: [
          v => !!v || 'Email обязателен',
          v => emailV(v) || 'Поле email неверного формата',
        ],
      }
    },
    computed: {
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
      // side panel
      defaultForm () {
        return {
          method: 'email',
          email: null,
          phone: null,
          role_id: null,
        }
      },
      validateForm () {
        if (this.form.method && this.form.method === 'email' && this.form.email && emailV(this.form.email) && this.form.role_id) {
          return true
        }
        if (this.form.method && this.form.method !== 'email' && this.form.phone && this.form.role_id) {
          return true
        }
        return false
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
      // side panel
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
      async deleteStaff (item) {
        try {
          this.loadingDelete = true
          const user = {
            id: item.id,
          }
          // console.log(user)
          await this.$store.dispatch('company/staff/delete', user)
        } finally {
          this.loadingDelete = false
        }
      },
      async updateRole (item) {
        try {
          this.loadingUpdate = true
          const user = {
            user_id: item.id,
            role_id: item.role_id,
          }
          // console.log(user)
          await this.$store.dispatch('company/staff/update', user)
        } finally {
          this.loadingUpdate = false
        }
      },
      async inviteStaff () {
        if (!this.$refs.staffForm.validate()) return
        try {
          this.loadingCreate = true
          const item = {
            type: this.form.method,
            login: (this.form.method === 'email' ? this.form.email : this.form.phone.replace(/[+\- ()]/gm, '')),
            role_id: this.form.role_id,
          }
          // console.log(item)
          await this.$store.dispatch('company/staff/invite', item)
          this.sidePanelActive = false
        } finally {
          this.loadingCreate = false
        }
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

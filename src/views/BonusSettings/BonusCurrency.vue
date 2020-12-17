<template>
  <div>
    <v-row>
      <v-col
        cols="12"
      >
        <div style="display: flex;">
          <v-spacer />
          <v-btn
            color="secondary"
            small
            @click="openBonusUnitDialog()"
          >
            <v-icon style="width: 15px; height: 15px; margin-right: 8px; font-size: 16px;">
              fa-plus
            </v-icon>
            Добавить валюту
          </v-btn>
        </div>
      </v-col>
      <v-col
        cols="12"
      >
        {{ tableData }}
        <v-data-table
          :headers="headers"
          :items="tableData"
          :options.sync="tableSettings"
          :single-expand="true"
          item-key="uuid"
          :show-expand="false"
          class="plus-table"
          hide-default-footer
          :server-items-length="totalCount"
          @update:sort-by="fetchData()"
          @update:sort-desc="fetchData()"
          @click:row="openBonusUnitDialog($event)"
        >
          <template v-slot:item.id="{ item }">
            <div class="cell-text">
              {{ item.id }}
            </div>
          </template>

          <template v-slot:item.name="{ item }">
            <div class="cell-text">
              {{ item.name }}
            </div>
          </template>

          <template v-slot:item.max_value="{ item }">
            <div class="cell-text">
              {{ getCurrencyType(item.max_value, item.with_goal) }}
            </div>
          </template>

          <template v-slot:item.icon="{ item }">
            <v-avatar
              class="cell-img"
              size="42"
            >
              <img
                :src="item.icon"
                style="padding: 2px;"
                alt="иконка валюты"
              >
            </v-avatar>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-row
      align="center"
      class="pagination"
    >
      <v-col>
        <div class="table-pagination-block">
          <div
            style="margin-right: 20px;"
          >
            Всего {{ totalCount }} {{ getWord(totalCount, wordOperations) }} на {{ pagesCount }}
            {{ getWord(pagesCount, wordPages) }}
          </div>

          <select-page-limit
            min-width="200px"
            :items="paginationOptions"
            :model.sync="tableSettings.itemsPerPage"
            item-value="value"
            item-label="text"
          />

          <div class="app__spacer" />

          <div class="text-center">
            <v-pagination
              v-model="tableSettings.page"
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

    <!-- <toolbar :has-changes="hasChanges" /> -->
    <bonus-unit-dialog
      v-if="bonusDialog"
      v-model="bonusDialog"
      :bonus-unit="editedBonusUnit"
      :program-id="programId"
    />
  </div>
</template>

<script>
  import SelectPageLimit from '@/components/dialogs/SelectPageLimit'
  import DataTableMixin from '@/mixins/dataTable'
  import BonusUnitDialog from '@/views/BonusSettings/components/BonusUnitDialog'

  export default {
    name: 'BonusCurrency',
    components: {
      BonusUnitDialog,
      SelectPageLimit,
    },
    mixins: [DataTableMixin],
    data () {
      return {
        editedBonusUnit: null,
        bonusDialog: false,
        saveAction: false,
        hasChangesMain: false,
        //
        tableKey: 'BonusCurrencyTable',
        headers: [
          {
            text: 'ID',
            align: 'start',
            value: 'id',
          },
          {
            text: 'Название',
            value: 'name',
          },
          {
            text: 'Тип валюты',
            value: 'max_value',
          },
          {
            text: 'Иконка',
            value: 'icon',
          },
        ],
        wordPages: ['странице', 'страницах', 'страницах'],
        wordOperations: ['валюта', 'валюты', 'валют'],
      }
    },
    computed: {
      tableData () {
        return this.$store.getters['company/bonus_units/bonusUnits']
      },
      totalCount () {
        return 1
      },
      pagesCount () {
        return 1
      },
      programId () {
        return this.$store.getters.programId
      },
    },
    created () {
      // переопределяем настройки таблицы по-умолчанию
      this.tableSettings = this.getDataTableSetting(this.tableKey, this.tableSettings)
    },
    methods: {
      getCurrencyType (maxValue, withGoal) {
        if (!maxValue) return 'цифровая'
        if (withGoal) return 'с целью'
        return 'без цели'
      },
      openBonusUnitDialog (bonusUnit = null) {
        console.log(bonusUnit)
        this.bonusDialog = true
        this.editedBonusUnit = bonusUnit
      },
      async cancelEdit () {
        try {
          if (this.hasChangesMain) {
            await this.$confirm(
              'Имеются не сохраненные изменения. Закрыть без сохранения?',
              'Настройка программы лояльности',
              {
                confirmButtonText: 'Закрыть',
                cancelButtonText: 'Отмена',
                type: 'warning',
              })
          }
          this.$router.back()
        } catch (error) {

        }
      },
      async globalSave () {
        console.log('globalSave')
        try {
          this.saveAction = true
          await this.$refs.BonusSettingsMain.save()
        } catch (e) {

        } finally {
          this.saveAction = false
        }
      },
      getWord (number, words) {
        const cases = [2, 0, 1, 1, 1, 2]
        return words[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]]
      },
      fetchData () {
        console.log('fetchData!!!')
      },
    },
  }
</script>

<style lang="scss" scoped>
.main-wrap {
  max-width: 676px;
  width: 100%;
  margin: 0 auto;
}

.cell-text {
  font-style: normal;
  font-weight: 400;
  font-size: 13px;
  line-height: 17px;
  color: #2A2A34;
}

.cell-img {
  border-radius: 100px;
  border: 1px solid #F2F2F7;
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

.table-cell_avatar {
  margin-right: 8px;
  width: 25px;
  height: 25px;
  border-radius: 25px;
  cursor: pointer;
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
</style>

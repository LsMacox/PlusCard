<template>
  <v-row
    no-gutters
  >
    <v-col>
      <div class="app__filter">
        <!--поле выбора-->
        <div
          class="app__filter-block-input"
          style="border: 1px solid #D7D7E0; border-radius: 10px;"
          @click.stop="switchShow"
        >
          <v-icon
            v-show="emptyFastFilter"
            class="app__filter-block-input-icon-prepend"
          >
            $iconify_search-outlined
          </v-icon>

          <div style="width: 100%;">
            <!-- КЛИЕНТЫ -->
            <div
              v-for="(item, i) in fastFilter.clients"
              :key="`client${i}`"
              class="app__filter-chip"
              style="background-color: #EBF1FF;"
            >
              <div
                class="app__filter-chip-content"
                style="color: #4776E6;"
              >
                {{ item.FIO }}
                <v-icon
                  class="app__filter-chip-icon-append"
                  style="color: #4776E6;"
                  @click.stop="clearItemFastFilter('clients', item)"
                >
                  $iconify_jam-close
                </v-icon>
              </div>
            </div>

            <!-- СЕГМЕНТЫ -->
            <div
              v-for="(item, i) in fastFilter.segments"
              :key="`segment${i}`"
              class="app__filter-chip"
              :style="item.color != undefined ? `color: ${item.color}; background: ${hexToRgbA(item.color, '0.15')}` : ''"
            >
              <div
                class="app__filter-chip-content"
                :style="item.color != undefined ? `color: ${item.color}; background: ${hexToRgbA(item.color, '0.15')}` : ''"
              >
                {{ item.label }}
                <v-icon
                  class="app__filter-chip-icon-append"
                  :style="`color: ${item.color};`"
                  @click.stop="clearItemFastFilter('segments', item)"
                >
                  $iconify_jam-close
                </v-icon>
              </div>
            </div>

            <!--поле ввода-->
            <!--chip быстрый поиск-->
            <div
              v-if="fastFilter.query"
              class="app__filter-chip"
            >
              <div class="app__filter-chip-content">
                {{ fastFilter.query }}
                <v-icon
                  class="app__filter-chip-icon-append"
                  @click.stop="clearFilterQuery()"
                >
                  $iconify_jam-close
                </v-icon>
              </div>
            </div>
            <!--поле ввода-->
            <input
              class="app__filter-block-input-field"
              placeholder="Поиск и фильтр"
            >
          </div>

          <v-icon
            v-show="!emptyFastFilter"
            class="app__filter-block-input-icon-append"
            @click.stop="clearFastFilter"
          >
            $iconify_chrome-close
          </v-icon>
        </div>

        <!--окно фильтра-->
        <div
          v-show="show"
          class="app__filter-block"
          @click.stop=""
        >
          <!--окно фильтра - поле ввода -->
          <div
            class="app__filter-block-input"
          >
            <v-icon
              class="app__filter-block-input-icon-prepend"
            >
              $iconify_search-outlined
            </v-icon>
            <input
              ref="search"
              v-model="query"
              class="app__filter-block-input-field"
              placeholder="Поиск и фильтр"
              @input="querySearch(query)"
            >

            <div class="app__spacer" />

            <v-icon
              class="app__filter-block-input-icon-append app__filter-block-icon-close"
              @click="close()"
            >
              $iconify_chrome-close
            </v-icon>
            <!--
            <v-icon
              class="app__filter-block-input-icon-append app__filter-block-icon-check"
              @click="apply()"
            >
              $iconify_bx-check
            </v-icon>
            -->
          </div>
          <!--окно фильтра - содержимое -->
          <div class="app__filter-content">
            <!-- Пустота -->
            <div
              v-if="accountsForFilter && !accountsForFilter.length && segmentsForFilter && !segmentsForFilter.length"
              class="app__filter-content-dummy"
            >
              Пока ничего не найдено
            </div>
            <!-- Клиенты -->
            <div
              v-if="accountsForFilter && accountsForFilter.length"
              class="app__filter-content-header"
            >
              Клиенты
            </div>
            <div
              v-for="(item, i) in accountsForFilter"
              :key="`accountsForFilter${i}`"
              class="app__filter-content-client"
              @click="setFilter('clients', item)"
            >
              <img
                class="app__filter-content-client-avatar"
                :src="item.avatar"
              >
              <div class="body-m-regular neutral-700--text">
                {{ item.FIO }}
              </div>
              <div
                v-if="getAdditionalSearch(item)"
                class="body-s-regular neutral-500--text"
                style="padding: 1px 0 0 12px;"
              >
                {{ getAdditionalSearch(item) }}
              </div>
            </div>
            <!-- Сегменты -->
            <div
              v-if="segmentsForFilter && segmentsForFilter.length"
              class="app__filter-content-header"
            >
              Сегменты
            </div>
            <div
              v-for="(item, i) in segmentsForFilter"
              :key="`segmentsForFilter${i}`"
              class="app__filter-content-client"
            >
              <p
                class="body-s-semibold mb-0"
                style="cursor: pointer; display: inline-block; padding: 4px 8px 4px 8px; border-radius: 4px;"
                :style="item.color != undefined ? `color: ${item.color}; background: ${hexToRgbA(item.color, '0.15')}` : ''"
                @click="setFilter('segments', item)"
              >
                {{ item.name }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    data () {
      return {
        query: null,
        filter: {
          clients: [],
          segments: [],
        },
        fastFilter: {
          clients: [],
          segments: [],
        },
        show: false,
        searchClient: null,
        loading: false,
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
      accountsForFilter () {
        return this.$store.getters['crm/client/accountsForFilter']
      },
      segmentsForFilter () {
        return this.segmentsStore.filter(item => {
          const name = String(item.name).toLowerCase()
          const query = String(this.query).toLowerCase()
          if (name && query && name.indexOf(query) !== -1) return item
        })
      },
      segmentsStore () {
        return this.$store.getters['crm/segment/segments']
      },
      filterStore () {
        return this.$store.getters['crm/client/filter']
      },
      filterDefault () {
        return this.$store.getters['crm/client/filterDefault']
      },
      emptyFastFilter () {
        if (this.fastFilter.clients.length ||
          this.fastFilter.segments.length) return false
        return true
      },
    },
    watch: {
      program (v) {
        // обнуление при смене программы
        if (v) {
          this.filter = JSON.parse(JSON.stringify(this.filterStore))
          this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
          // this.setFastFilter(this.filter)
        }
      },
    },
    created () {
      this.filter = JSON.parse(JSON.stringify(this.filterStore))
      this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
      // this.setFastFilter(this.filter)

      document.addEventListener('click', () => {
        if (this.show) {
          this.close()
        }
      })
    },
    methods: {
      async switchShow () {
        this.show = true
        // обнуление поиска и найденных клиентов
        this.query = null
        this.$store.commit('crm/client/SET_ACCOUNTS_FOR_FILTER', [])
        //
        await this.$nextTick()
        this.$refs.search.focus()
      },
      hexToRgbA (hex, opacity) {
        let c
        if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
          c = hex.substring(1).split('')
          if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]]
          }
          c = '0x' + c.join('')
          return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + Number(opacity) + ')'
        }
        throw new Error('Bad Hex')
      },
      getFilterClass (field, item) {
        if (this.filter && this.filter[field].includes(item.id)) return 'app__filter-content-chip app__filter-content-chip-active'
        return 'app__filter-content-chip'
      },
      setFilter (field, item) {
        // только один клик - один сегмент
        this.filter[field] = [item.id]
        if (field === 'clients') {
          this.fastFilter[field] = [{
            id: item.id,
            FIO: item.FIO,
          }]
          // обновляем массив отфильтрованных клиентов
          this.$store.commit('crm/client/SET_FILTERED_CLIENTS', [item])
        }
        if (field === 'segments') {
          this.fastFilter[field] = [{
            id: item.id,
            label: item.name,
            color: item.color,
          }]
        }
        // сохраняем фильтр в store
        this.$store.commit('crm/client/SET_FILTER', this.filter)
        this.show = false
        /*
        const index = this.filter[field].indexOf(item.id)
        if (index === -1) {
          this.filter[field].push(item.id)
        }
        else {
          this.filter[field].splice(index, 1)
        }
        */
      },
      setFastFilter (filter) {
        if (filter && filter.query) this.fastFilter.query = `Быстрый поиск: ${filter.query}`
        filter.pbr.forEach(item => {
          const operation = this.operations.find(objItem => objItem.id === item)
          if (operation) {
            const obj = { id: item, label: `Операция: ${operation.title}` }
            if (!this.fastFilter.pbr.find(objItem => objItem.id === item)) this.fastFilter.pbr.push(obj)
          }
        })
        filter.bu.forEach(item => {
          const unit = this.units.find(objItem => objItem.id === item)
          if (unit) {
            const obj = { id: item, label: `Валюта: ${unit.name}` }
            if (!this.fastFilter.bu.find(objItem => objItem.id === item)) this.fastFilter.bu.push(obj)
          }
        })
        filter.operator.forEach(item => {
          const operator = this.operators.find(objItem => objItem.id === item)
          if (operator) {
            const obj = { id: item, label: `Оператор: ${operator.label}` }
            if (!this.fastFilter.operator.find(objItem => objItem.id === item)) this.fastFilter.operator.push(obj)
          }
        })
        filter.client.forEach(item => {
          const client = this.foundClients.find(objItem => objItem.id === item)
          if (client) {
            const obj = { id: item, label: `Клиент: ${client.label}` }
            if (!this.fastFilter.client.find(objItem => objItem.id === item)) this.fastFilter.client.push(obj)
          }
        })
      },
      clearItemFastFilter (field, item) {
        const i = this.fastFilter[field].findIndex(objItem => objItem.id === item.id)
        if (i !== -1) this.fastFilter[field].splice(i, 1)

        const filter = JSON.parse(JSON.stringify(this.filterStore))
        const j = filter[field].findIndex(elem => elem === item.id)
        if (j !== -1) filter[field].splice(j, 1)

        this.filter = filter
        this.$store.commit('crm/client/SET_FILTER', JSON.parse(JSON.stringify(filter)))
        // обнуляем массив отфильтрованных клиентов
        if (field === 'clients') this.$store.commit('crm/client/SET_FILTERED_CLIENTS', [])
      },
      clearFastFilter () {
        this.filter = JSON.parse(JSON.stringify(this.filterDefault))
        this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
        this.$store.commit('crm/client/SET_FILTER', JSON.parse(JSON.stringify(this.filter)))
        // обнуляем массив отфильтрованных клиентов
        this.$store.commit('crm/client/SET_FILTERED_CLIENTS', [])
      },
      getAdditionalSearch (account) {
        let found = false
        if (account) {
          const query = String(this.query).toLowerCase()
          // приоритет поиска в обратном порядке
          if (query && account.created_at && String(account.created_at).indexOf(query) !== -1) {
            found = `Создан: ${account.created_at}`
          }
          if (query && account.last_activity && String(account.last_activity).indexOf(query) !== -1) {
            found = `Был(а) в сети ${account.last_activity}`
          }
          if (query && account.number && String(account.number).indexOf(query) !== -1) {
            found = `№ карты: ${account.number}`
          }
          if (query && account.barcode && String(account.barcode).indexOf(query) !== -1) {
            found = `Штрих-код: ${account.barcode}`
          }
          if (query && account.email && String(account.email).indexOf(query) !== -1) {
            found = `${account.email}`
          }
          if (query && account.phone && String(account.phone).indexOf(query) !== -1) {
            found = `Телефон: ${account.phone}`
          }
        }
        return found
      },
      async querySearch (search) {
        console.log(search)
        if (search.length >= 2) {
          try {
            this.loading = true
            const item = {
              program_id: this.program.id,
              search,
            }
            await this.$store.dispatch('crm/client/querySearch', item)
          } finally {
            this.loading = false
          }
        }
      },
      clearFilterQuery () {
        this.fastFilter.query = null
        const filter = JSON.parse(JSON.stringify(this.filterStore))
        filter.query = null
        this.$store.commit('crm/client/SET_FILTER', JSON.parse(JSON.stringify(filter)))
      },
      close () {
        this.show = false
      },
      apply () {
        this.$store.commit('crm/client/filter', this.filter)
        this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
        this.setFastFilter(this.filter)
        this.show = false
      },
    },
  }
</script>

<style lang="scss" scoped>
.app__filter {
  position: relative;

  .app__filter-block {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: #FFFFFF;
    border: 1px solid #E8E8ED;
    box-sizing: border-box;
    box-shadow: 0px 12px 24px rgba(88, 93, 106, 0.1);
    border-radius: 10px;
    z-index: 100;

    .app__filter-content {
      padding: 0 20px 8px 20px;
      max-height: 400px;
      min-height: 42px;
      overflow: auto;

      .app__filter-content-dummy {
        margin-top: 10px;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 21px;
        letter-spacing: 0.1px;
        color: #9191A1;
      }

      .app__filter-content-header {
        margin: 20px 0 4px 0;
        font-style: normal;
        font-weight: 600;
        font-size: 15px;
        line-height: 21px;
        letter-spacing: 0.1px;
        color: #2A2A34;
      }

      .app__filter-content-client {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin: 10px 0;

        .app__filter-content-client-avatar {
          width: 29px;
          height: 29px;
          border-radius: 29px;
          margin-right: 8px;
        }
      }

      .app__filter-content-chip {
        display: inline-block;
        margin: 8px 8px 0 0;
        padding: 10px 12px;
        font-style: normal;
        font-weight: 600;
        font-size: 13px;
        line-height: 17px;
        color: #9191A1;
        background: #F2F2F7;
        border-radius: 8px;
        cursor: pointer;
      }

      .app__filter-content-chip-active {
        background: #EBF1FF;
        color: #4776E6;
      }
    }
  }
}
.app__filter-block-input {
  display: flex;
  align-items: center;
  min-height: 45px;
  color: #9191A1;
  border-bottom: 1px solid #D7D7E0;
  box-sizing: border-box;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;

  .app__filter-block-input-icon-prepend {
    margin: 6px 0 6px 12px;
  }

  .app__filter-block-input-icon-append {
    margin: 6px 12px 6px 0;
  }

  .app__filter-block-input-field {
    outline: none !important;
    margin: 13px 0;
    padding: 0 10px;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 17px;
  }
}

.app__filter-block-icon-close {
  color: #B5B5C4 !important;
  cursor: pointer;
}

.app__filter-block-icon-check {
  width: 30px !important;
  height: 28px !important;
  position: relative;
  top: -1px;
  color: #4776E6 !important;
  cursor: pointer;
}

.app__filter-chip {
  display: inline-flex;
  align-items: center;
  //background-color: #EBF1FF;
  border-radius: 6px;
  max-width: 100%;
  margin: 3px;
  //padding: 0 6px 0 12px;
  height: 37px;
  white-space: nowrap;

  .app__filter-chip-content {
    align-items: center;
    display: inline-flex;
    height: 100%;
    max-width: 100%;
    //color: #4776E6;
    border-radius: 6px;
    padding: 0 6px 0 12px;
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 17px;
  }

  .app__filter-chip-icon-append {
    margin: 0 0 0 6px;
    //color: #4776E6;
  }
}
</style>

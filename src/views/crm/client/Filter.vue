<template>
  <v-row
    no-gutters
  >
    <v-col>
      <div class="app__filter">
        <!--поле выбора-->
        <v-row
          class="app__filter-block-input"
          style="border: 1px solid #D7D7E0; border-radius: 10px;"
          no-gutters
          justify="center"
          @click.stop="switchShow"
        >
          <v-icon
            v-show="emptyFastFilter|| true"
            class="app__filter-block-input-icon-prepend"
          >
            $iconify_search-outlined
          </v-icon>

          <v-col>
            <v-row no-gutters>
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
              <v-col style="min-width:200px">
                <input
                  class="app__filter-block-input-field"
                  placeholder="Поиск и фильтр"
                >
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="auto">
            <v-row no-gutters>
              <v-icon
                v-show="!emptyFastFilter"
                class="app__filter-block-input-icon-append"
                @click.stop="clearFastFilter"
              >
                $iconify_chrome-close
              </v-icon>
            </v-row>
          </v-col>
        </v-row>

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
              class="app__filter-block-input-icon-append app__filter-block-icon-adv-filter"
              :color="advancedFilter ? '#4776e6!important' : '#B5B5C4!important'"
              @click="openAdvFilter"
            >
              $iconify_bx-filter-alt
            </v-icon>

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
            <div>
              <query-builder
                v-if="advancedFilter"
                :rules="queryRules"
                :value="queryValue"
                @apply-query-value="applyQuery"
              />
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
              ref="resultAccountDiv"
              class="app__filter-content-client"
              @click="setFilter('clients', item)"
            >
              <img
                class="app__filter-content-client-avatar"
                :src="item.user ? item.user.avatar : ''"
              >
              <div class="body-m-regular neutral-700--text">
                [{{ item.id }}] {{ ( item.user ? item.user.FIO : '' + (item.client_name && item.client_name != item.user.FIO)? `(${item.client_name})` : '' ) }}
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
            <v-row
              v-if=" withSegments && segmentsForFilter && segmentsForFilter.length"
              no-gutters
            >
              <v-col>
                <v-row
                  class="app__filter-content-header"
                  no-gutters
                >
                  Сегменты
                </v-row>
                <v-row
                  v-for="(item, i) in segmentsForFilter"
                  :key="`segmentsForFilter${i}`"
                  class="app__filter-content-client"
                  no-gutters
                >
                  <p
                    class="body-s-semibold mb-0"
                    style="word-break: break-word; cursor: pointer; display: inline-block; padding: 4px 8px 4px 8px; border-radius: 4px;"
                    :style="item.color != undefined ? `color: ${item.color}; background: ${hexToRgbA(item.color, '0.15')}` : ''"
                    @click="setFilter('segments', item)"
                  >
                    {{ item.name }}
                  </p>
                </v-row>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    components: {
      QueryBuilder: () => import('@/components/query-builder/VueQueryBuilder.vue'),
    },
    props: {
      withSegments: {
        type: Boolean,
        default: true,
      },
    },
    data () {
      return {
        advancedFilter: false,
        queryRules: [
          {
            id: 'created',
            label: 'Создание',
            field: 'date',
            type: 'date',
            input: 'date',
            operator: 'equal',
            value: '2020-12-10',
          },
          {
            id: 'client',
            label: 'Имя клиента',
            field: 'text',
            type: 'text',
            input: 'text',
            operator: 'equal',
          },
          {
            id: 'account',
            label: 'Карта клиента',
            field: 'numeric',
            type: 'numeric',
            input: 'numeric',
            operator: 'equal',
          },
        ],
        query: null,
        prevQuery: null,
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
      segmentsRule () {
        const segments = []
        let segmentsRule = {}

        this.segmentsStore.forEach(item => {
          segments.push({
            id: item.id,
            label: item.name,
          })
        })

        segmentsRule = {
          id: 'segment',
          label: 'Сегмент',
          field: 'checkbox',
          type: 'checkbox',
          input: 'checkbox',
          operator: 'equal',
          choices: segments,
        }
        return segmentsRule
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
      queryValue () {
        return this.$store.getters['crm/client/queryValue']
      },
    },
    watch: {
      show (v) {
        if (v === true) {
          if (this.queryValue) {
            this.queryRules.push(this.segmentsRule)
            this.advancedFilter = true
          }
        }
      },
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
          // this.close()
        }
      })

      this.init()
    },
    methods: {
      async init () {
        await this.getSegments()
        this.appendQueryFilter()
      },
      openAdvFilter () {
        console.log('SEGMENTS')
        console.log(this.segmentsRule)
        console.log('SEGMENTS')
        this.queryRules.push(this.segmentsRule)
        this.advancedFilter = !this.advancedFilter
      },
      async applyQuery (query) {
        this.$store.commit('crm/client/SET_QUERY_VALUE', query)
        this.$emit('apply-filter')
      },
      appendQueryFilter () {
        const segmentId = +this.$route.query.segmentId
        if (segmentId) {
          console.log('segmentId', segmentId)
          const segment = this.$_.findWhere(this.segmentsStore, { id: segmentId })
          segment && this.setFilter('segments', segment)
        }
      },
      async getSegments () {
        try {
          console.log('GET_SEGMENTS')
          this.getSegmentsAction = true
          const payload = {
            program_id: this.program.id,
          }
          await this.$store.dispatch('crm/segment/segments', payload)
        } finally {
          this.getSegmentsAction = false
        }
      },
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
        if (field === 'clients') {
          this.filter[field] = [item.user.id]
          this.fastFilter[field] = [{
            id: item.user.id,
            FIO: item.user.FIO,
          }]
          // обновляем массив отфильтрованных клиентов
          this.$store.commit('crm/client/SET_FILTERED_CLIENTS', [item])
        } else if (field === 'segments') {
          this.filter[field] = [item.id]
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
        if (account && this.query) {
          const query = String(this.query).toLowerCase()
          // приоритет поиска в обратном порядке
          if (account.last_activity) {
            const lastActivity = this.$moment.utc(account.last_activity).local().format(this.$config.date.DATETIME_FORMAT_MIN2)
            if (String(lastActivity).indexOf(query) !== -1) {
              found = `Был(а) в сети ${lastActivity}`
            }
          }
          if (account.created_at) {
            const createdAt = this.$moment.utc(account.created_at).local().format(this.$config.date.DATETIME_FORMAT_MIN2)
            if (String(createdAt).indexOf(query) !== -1) {
              found = `Создан: ${createdAt}`
            }
          }
          if (account.number && String(account.number).indexOf(query) !== -1) {
            found = `№ карты: ${account.number}`
          }
          if (account.barcode && String(account.barcode).indexOf(query) !== -1) {
            found = `Штрих-код: ${account.barcode}`
          }
          if (account.user && account.user.email && String(account.user.email).indexOf(query) !== -1) {
            found = `${account.user.email}`
          }
          if (account.user && account.user.phone && String(account.user.phone).indexOf(query) !== -1) {
            found = `Телефон: ${account.user.phone}`
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
            // this.$nextTick(()=>{
            //   this.replacer()
            // })
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
        console.log('CLOSE____CLOSE')
        this.show = false
        this.advancedFilter = false
      },
      apply () {
        console.log('APPLY____APPLY')
        this.$store.commit('crm/client/filter', this.filter)
        this.fastFilter = JSON.parse(JSON.stringify(this.filterDefault))
        this.setFastFilter(this.filter)
        this.show = false
      },
      replacer () {
        const items = this.$refs.resultAccountDiv
        console.log('replacer', items)
        items.forEach(element => {
          console.log(element)
          element.innerHTML = this.searchMatcher(element.innerHTML)
        })
        this.prevQuery = this.query
      },
      searchMatcher (str) {
        const rollbackReg = new RegExp('<b>' + this.prevQuery + '</b>', 'ig')
        const regexp = new RegExp(this.query, 'ig')

        if (str) {
          return str.replace(rollbackReg, this.prevQuery).replace(regexp, '<b>' + this.query + '</b>')
        } else return ''
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
    width: 100%;
  }
}

.app__filter-block-icon-close {
  color: #B5B5C4 !important;
  cursor: pointer;
}

.app__filter-block-icon-adv-filter {
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

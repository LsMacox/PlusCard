<template>
  <div class="rule-container">
    <div class="rule-header">
      <div class="rule-filter-container">
        <v-select
          outlined
          v-model="selectedRule"
          :items="rules"
          item-value="id"
          item-text="label"
          style="width: 300px"
          @change="ruleChange"
        />

        <v-select
          outlined
          v-if="subRules !== null && subRules.length > 0"
          v-model="selectedSubRule"
          :items="subRules"
          item-value="id"
          item-text="label"
          @change="subRuleChange"
          style="width: 300px"
        />
      </div>

      <div class="rule-operator-container">
        <v-select
          outlined
          v-model="query.selectedOperator"
          :items="selectedRuleObj.operators"
          item-value="value"
          item-text="label"
          @change="subRuleChange"
          style="width: 150px"
        />
      </div>

      <div class="rule-value-container">
        <v-text-field
          v-if="selectedRuleObj.inputType === 'text'"
          v-model="query.value"
          outlined
          type="text"
          style="width: 300px"
        />

        <v-text-field
          v-if="selectedRuleObj.inputType === 'number'"
          v-model="query.value"
          outlined
          type="number"
          style="width: 300px"
        />

        <v-menu
          v-model="dateMenu"
          v-if="selectedRuleObj.inputType === 'date' || selectedRuleObj.inputType === 'datetime'"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="290px"
          style="width: 300px"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="query.value"
              readonly
              outlined
              v-bind="attrs"
              v-on="on"
              style="width: 300px"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="query.value"
            @input="dateMenu = false"
            no-title
            scrollable
            locale="ru-ru"
            style="width: 300px"
          ></v-date-picker>
        </v-menu>
<!--        <v-container-->
<!--          fluid-->
<!--          v-if="selectedRuleObj.inputType === 'checkbox'"-->
<!--          style="width: 300px"-->
<!--        >-->
<!--          <v-row>-->
<!--            <v-col-->
<!--              cols="12"-->
<!--              sm="4"-->
<!--              md="4"-->
<!--            >-->
<!--              <v-checkbox-->
<!--                v-for="(choice, item) in selectedRuleObj.choices"-->
<!--                :key="item"-->
<!--                v-model="query.value"-->
<!--                :label="choice"-->
<!--                :value="choice"-->
<!--                hide-details-->
<!--              />-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--        </v-container>-->
        <v-select
            outlined
            multiple
            v-if="selectedRuleObj.inputType === 'checkbox'"
            v-model="query.value"
            :items="selectedRuleObj.choices"
            item-value="id"
            item-text="label"
            style="width: 475px"
        >
          <template v-slot:selection="{ item, index }">
            <v-chip v-if="index < 3">
              <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 125px;">{{ item.label }}</span>
            </v-chip>
            <span
                v-if="index === 3"
                class="grey--text caption"
            >
          (+{{ query.value.length - 3 }} другие)
        </span>
          </template>
        </v-select>
        <v-radio-group
          v-if="selectedRuleObj.inputType === 'radio'"
          v-model="query.value"
          style="width: 300px"
        >
          <v-radio
            v-for="choice in selectedRuleObj.choices"
            :key="choice"
            :label="choice"
            :value="choice"
          />
        </v-radio-group>
        <v-select
          outlined
          v-if="selectedRuleObj.inputType === 'select'"
          v-model="query.value"
          :items="selectedRuleObj.choices"
          item-value="id"
          item-text="label"
          style="width: 300px"
        />
      </div>

      <div class="btn-group pull-right rule-actions">
        <v-btn
          x-small
          color="error-500"
          @click="remove"
        >
          <iconify-icon
            icon="ion-close"
            height="21"
          />
          Удалить
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
  import deepClone from '../utils/deepClone.js'

  export default {
    name: 'QueryBuilderRule',

    props: ['query', 'index', 'rules'],

    data () {
      return {
        dateMenu: false,
        selectedRuleObj: this.rules[0],
        selectedRule: this.query.rule || this.rules[0].id,
        selectedSubRule: null,
        subRules: [],
        date: new Date().toISOString().substr(0, 10),
        dateFormatted: this.formatDate(new Date().toISOString().substr(0, 10)),
      }
    },
    computed: {
      computedDateFormatted () {
        return this.formatDate(this.date)
      },
    },

    watch: {
      date (val) {
        this.dateFormatted = this.formatDate(this.date)
      },
    },

    mounted () {
      // Set a default value for these types if one isn't provided already
      console.log('MOUNTED...')
      this.initValue()

      var _this = this
      var selectedRuleCopy = _this.selectedRule
      var splitIndex = selectedRuleCopy.indexOf('-')
      if (splitIndex > -1) {
        _this.selectedRule = selectedRuleCopy.substring(0, splitIndex)
        _this.selectedSubRule = selectedRuleCopy.substring(splitIndex + 1)
        this.rules.forEach(function (rule) {
          if (rule.id === _this.selectedRule) {
            var isBreak = false
            _this.subRules = rule.subRules
            rule.subRules.forEach(function (subRule) {
              if (subRule.id === _this.selectedSubRule) {
                _this.selectedRuleObj = subRule
                isBreak = true
                return false
              }
            })
            if (isBreak) {
              return false
            }
          }
        })
      } else {
        this.rules.forEach(function (rule) {
          if (rule.id === _this.selectedRule) {
            _this.selectedRuleObj = rule
            return false
          }
        })
      }
    },

    methods: {
      formatDate (date) {
        if (!date) return null

        const [year, month, day] = date.split('-')
        return `${month}/${day}/${year}`
      },
      parseDate (date) {
        if (!date) return null

        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      remove: function () {
        this.$emit('child-deletion-requested', this.index)
      },
      ruleChange: function () {
        console.log('RULES CHANGE')
        const _this = this
        this.query.value = null
        this.subRules = []
        this.selectedSubRule = null
        this.rules.forEach(function (value) {
          if (value.id === _this.selectedRule) {
            if (
              value.subRules !== undefined &&
              value.subRules !== null &&
              value.subRules.length > 0
            ) {
              _this.subRules = value.subRules
            } else {
              _this.selectedRuleObj = value
              _this.query.rule = _this.selectedRule
              _this.initValue()
            }
          }
        })
        console.log(_this.selectedRuleObj)
        this.query.selectedOperator = this.selectedRuleObj.operators[0].value
      },
      subRuleChange: function () {
        const _this = this
        this.query.value = null
        console.log('subrules')
        console.log(this.subRules)
        console.log('subrules')
        this.subRules.forEach(function (value) {
          if (value.id === _this.selectedSubRule) {
            _this.selectedRuleObj = value
            _this.query.selectedOperator =
              _this.selectedRuleObj.operators[0].value
            _this.query.rule = _this.selectedRule + '-' + _this.selectedSubRule
            _this.initValue()
          }
        })
      },
      initValue () {
        this.query.dataType = this.selectedRuleObj.dataType
        if (this.query.value === null) {
          const updated_query = deepClone(this.query)
          if (this.selectedRuleObj.inputType === 'checkbox') {
            updated_query.value = []
          }
          if (
            this.selectedRuleObj.inputType === 'select' ||
            this.selectedRuleObj.inputType === 'radio'
          ) {
            updated_query.value = this.selectedRuleObj.choices[0]
          }
          if (
            this.selectedRuleObj.inputType === 'time' ||
            this.selectedRuleObj.inputType === 'date' ||
            this.selectedRuleObj.inputType === 'datetime'
          ) {
            updated_query.value = new Date().toISOString().substr(0, 10)
          }
          this.$emit('update:query', deepClone(updated_query))
        }
      },
    },
  }
</script>

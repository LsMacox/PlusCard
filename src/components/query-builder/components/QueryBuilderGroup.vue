<template>
  <div class="rules-group-container">
    <div class="rules-group-header">
      <div class="btn-group pull-right group-actions">
          <v-btn
            x-small
            color="primary-base"
            @click="addRule"
            style="margin-right: 2px;"
          >
            <iconify-icon
              icon="plus-outlined"
              height="21"
            />
            Добавить правило
          </v-btn>
          <v-btn
            v-if="depth < this.maxDepth"
            x-small
            color="primary-base"
            @click="addGroup"
          >
            <iconify-icon
              icon="plus-circle-outlined"
              height="21"
            />
            Добавить группу
          </v-btn>
          <v-btn
            v-if="depth > 1"
            x-small
            color="error"
            @click="remove"
            style="margin-left: 2px;"
          >
            Удалить
          </v-btn>
        <v-btn
            v-if="depth == 1"
            @click="apply"
            x-small
            color="success"
            style="margin-left: 2px;"
        >
          Применить
        </v-btn>
      </div>
      {{ query }}
      <div class="btn-group group-conditions">
        <v-btn-toggle
          v-model="query.logicalOperator"
        >
          <v-btn
            outlined
            :disabled="!hasMultipleRule"
            color="primary"
            value="AND"
            small
          >
            <span style="font-weight: 600;">И</span>
          </v-btn>
          <v-btn
            outlined
            :disabled="!hasMultipleRule"
             color="primary"
            value="OR"
            small
          >
            <span style="font-weight: 600;">ИЛИ</span>
          </v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <div class="rules-group-body">
      <div class="rules-list">
        <component
          :is="child.type"
          v-for="(child, index) in query.children"
          :key="index"
          :type="child.type"
          :query.sync="child.query"
          :rule-types="ruleTypes"
          :rules="rules"
          :index="index"
          :max-depth="maxDepth"
          :depth="depth + 1"
          @child-deletion-requested="removeChild"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import QueryBuilderRule from './QueryBuilderRule.vue'
  import deepClone from '../utils/deepClone.js'

  export default {
    name: 'QueryBuilderGroup',

    components: {
      QueryBuilderRule,
    },

    props: ['ruleTypes', 'type', 'query', 'rules', 'index', 'maxDepth', 'depth'],

    data () {
      return {}
    },
    computed: {
      hasMultipleRule () {
        return this.query.children.length > 1
      },
    },

    methods: {
      addRule () {
        const updated_query = deepClone(this.query)
        const child = {
          type: 'query-builder-rule',
          query: {
            rule: this.rules[0].id,
            selectedOperator: this.rules[0].operators[0].value,
            value: null,
          },
        }
        updated_query.children.push(child)
        this.$emit('update:query', updated_query)
      },

      addGroup () {
        const updated_query = deepClone(this.query)
        if (this.depth < this.maxDepth) {
          updated_query.children.push({
            type: 'query-builder-group',
            query: {
              logicalOperator: 'AND',
              children: [
                {
                  type: 'query-builder-rule',
                  query: {
                    rule: this.rules[0].id,
                    selectedOperator: this.rules[0].operators[0].value,
                    value: null,
                  },
                },
              ],
            },
          })
          this.$emit('update:query', updated_query)
        }
      },

      remove () {
        this.$emit('child-deletion-requested', this.index)
      },

      removeChild (index) {
        const updated_query = deepClone(this.query)
        updated_query.children.splice(index, 1)
        this.$emit('update:query', updated_query)
      },
      apply () {
        this.$emit('apply-query', this.query)
      },
    },
  }
</script>
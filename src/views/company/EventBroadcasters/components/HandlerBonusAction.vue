<template>
  <div>
    <!-- {{manualBonusRes}}
    {{bonusResList}} -->
    <v-row>
      <v-col>
        <BaseDialogFieldBlock
          title="Бонусная операция"
          description=""
        >
          <v-select
            v-model="model.action_json.bonus_res_id"
            class=""
            :items="bonusResList"
            item-text="title"
            item-value="id"
            placeholder="Выберите бонусную операцию"
            outlined
            :rules="[
              v => !!v || 'Выберите бонусную операцию',
            ]"
            :loading="GetActiveShortListAction || loading"
          />
        </BaseDialogFieldBlock>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <BaseDialogFieldBlock
          title="Сумма"
          description=""
        >
          <base-text-field
            v-model.number="model.action_json.value"
            :rules="valueRules"
            :validation-placement="'top'"
            placeholder="Сумма"
            class="percent-field"
            validate-on-blur
          />
        </BaseDialogFieldBlock>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import { isFilled, isNumeric, isPosNumber } from '@/utils/validate'
  import { RESOURCE_TYPE_ENUM } from '@/models/enums'

  import ProgramEventBroadcasterHandler from '@/models/program/broadcasterHandler'

  export default {
    components: { },
    model: {
      prop: 'model',
      event: 'update',
    },
    props: {
      model: {
        type: Object,
        required: true,
      },

      loading: {
        type: Boolean,
        default: false,
      },
    },
    constants: {

    },
    data () {
      return {
        GetListAction: false,
        valueRules: [
          (v) => isFilled(v) || 'Введите сумму',
          (v) => isNumeric(v) || 'Должно быть числом',
          (v) => isPosNumber(v) || 'Должно быть положительным',
          (v) => v <= this.$config.MAX_TRAN_VALUE || `Не более ${this.$config.MAX_TRAN_VALUE}`,
        ],

      }
    },
    computed: {
      ...mapGetters('company/bonus_resources', ['manualBonusRes']),
      bonusResList () {
        return this.manualBonusRes.filter(item => {
          if (this.model.action_type === ProgramEventBroadcasterHandler.ACTION_ENUM.BONUS_CREDIT.id) {
            return item.resource_type_enum === RESOURCE_TYPE_ENUM.SOURCE
          } else if (this.model.action_type === ProgramEventBroadcasterHandler.ACTION_ENUM.BONUS_DEBIT.id) {
            return item.resource_type_enum === RESOURCE_TYPE_ENUM.TARGET
          }
        })
      },
    },
    mounted () {
      this.loadBonusRes()
    },
    methods: {

      ...mapActions({
        GetList: 'company/bonus_resources/GetList',
      }),

      async loadBonusRes () {
        try {
          this.GetListAction = true
          await this.GetList(this.model.program_id)
        } catch (e) {
          console.error(e)
        } finally {
          this.GetListAction = false
        }
      },

    },
  }
</script>

<style lang="scss" scoped>

</style>

<template>
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      <v-col>
        <v-form
          ref="form"
          v-model="formValid"
        >
          <BaseMasterFieldBlock
            title="Отбор клиентов"
            description="Выберите клиентов, с которыми будет взаимодействовать этот бизнес-процесс."
          >
            <template v-slot:input>
              <v-row>
                <v-col>
                  <v-textarea
                    v-if="model.client_filter && model.client_filter.type === 'SQL'"
                    v-model="model.client_filter.clause"
                    :rows="3"
                    auto-grow
                    placeholder="Укажите фильтр "
                    outlined
                    maxlength="10000"
                    :success-messages="clientFilterSuccessMessage"
                    :error-messages="clientFilterErrorMessage"
                    :loading="clientValidationAction"
                    @blur="checkFilter"
                    @input="resetClientValidation"
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <base-ext-switch
                    v-model="model.with_trashed"
                    label="Отбирать удаленных клиентов"
                    @change="checkFilter"
                  />
                </v-col>
              </v-row>
            </template>
          </BaseMasterFieldBlock>

          <v-row>
            <v-col>
              <v-btn
                :disabled="!formValid"
                color="primary"
                class="master-next-btn"
                :loading="actionLoading"
                @click="onNextClick"
              >
                {{ actionText }}
                <v-icon
                  v-if="!!actionIcon"
                  :rigth="!actionLeft"
                >
                  {{ actionIcon }}
                </v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex'

  export default {
    components: {
    },
    model: {
      prop: 'model',
      event: 'change',
    },
    props: {
      model: {
        type: Object,
        required: true,
      },
      actionText: {
        type: String,
        default: 'Далее',
      },
      actionLeft: Boolean,
      actionIcon: {
        type: String,
        default: 'mdi-arrow-right',
      },
      actionLoading: Boolean,
    },
    data () {
      return {
        formValid: false,
        clientFilterSuccessMessage: null,
        clientFilterErrorMessage: null,
        clientValidationAction: false,

      }
    },
    computed: {
      valid () {
        return this.formValid && !this.clientFilterErrorMessage
      },
      clientFilterRules () {
        return [
          this.checkFilter,
        ]
      },
    },
    created () {

    },
    methods: {
      ...mapActions({
        CheckClientFilter: 'company/event_broadcasters/CheckClientFilter',
      }),
      resetClientValidation () {
        console.log('resetClientValidation')
        this.clientFilterSuccessMessage = null
        this.clientFilterErrorMessage = null
      },
      clientFilterChange (event) {
        console.log('event', event)
        this.clientFilterSuccessMessage = null
      },
      async checkFilter () {
        this.resetClientValidation()

        try {
          this.clientValidationAction = true
          if (this.model.client_filter && this.model.client_filter.type === 'SQL' && this.model.client_filter.clause) {
            if (this.model.client_filter.clause.length > 10000) throw new Error('Превышение максимальной длины')

            const postData = {
              program_id: this.model.program_id,
              client_filter: this.model.client_filter,
              with_trashed: this.model.with_trashed,
              goal_id: null,
            }
            const result = await this.CheckClientFilter(postData)
            if (result && !result.error) {
              this.clientFilterSuccessMessage = `В выборке ${result.count} клиентов`
            } else {
              this.clientFilterErrorMessage = result.error
            }
          }
        } catch (e) {
          console.error(e)
          this.clientFilterErrorMessage = e.message
        } finally {
          this.clientValidationAction = false
        }

        return !this.clientFilterErrorMessage
      },

      async validate () {
        return this.$refs.form.validate() && await this.checkFilter()
      },
      async onNextClick () {
        const valid = await this.validate()
        if (valid) {
          this.$emit('continue', true)
        }
      },
    },
  }
</script>
<style lang="scss" scoped>

@import '@/views/dashboard/form_component/_form-component.scss';
</style>

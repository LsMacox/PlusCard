<template>
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      <v-col cols="8">
        <v-form
          ref="form"
          v-model="formValid"
        >
          <BaseMasterFieldBlock
            title="Название"
            :horisontal="true"
          >
            <span
              slot="description"
            >Юридическое название компании без кавычек и формы собственности. Есть фирменное название? Отлично! Вводите его.</span>
            <template v-slot:input>
              <base-text-field
                v-model="program.name"
                :validate-on-blur="true"
                placeholder="Название компании"
                outlined
                counter
                minlength="1"
                maxlength="20"
                :rules="[
                  v => !!v || 'Название компании обязательно',
                  v => v.length <= 20 || 'Название компании не должно быть более 20 символов'
                ]"
              />
            </template>
          </BaseMasterFieldBlock>

          <BaseMasterFieldBlock
            title="Слоган"
          >
            <span slot="description">Напишите дополнительный текст, который позволит клиенту лучше понять чем ваша компания занимается, к чему стремится.</span>
            <template v-slot:input>
              <base-text-field
                v-model="program.slogan"
                :validate-on-blur="true"
                placeholder="Слоган компании"
                outlined
                counter
                maxlength="100"
                :rules="[
                  v => !v || v.length <= 100 || 'Название компании не должно быть более 20 символов'
                ]"
              />
            </template>
          </BaseMasterFieldBlock>

          <v-row>
            <v-col>
              <BaseMasterFieldBlock
                title="Карта клиента"
              >
                <div
                  slot="description"
                >
                  <div>Вот так будет выглядеть ваша карта в приложении.</div>
                  <div class="info-card-text">
                    <span>1. Измените цвет карты, кликнув на иконку</span>
                    <iconify-icon
                      class="info-card-text-icon"
                      icon="ion-color-fill-outline"
                      height="21"
                    />
                    <span>в шаблоне справа</span>
                  </div>
                  <div class="info-card-text">
                    <span>2. Загрузите логотип, кликнув на иконку</span>
                    <iconify-icon
                      class="info-card-text-icon"
                      icon="feather-download"
                      height="21"
                    />
                  </div>
                </div>
              </BaseMasterFieldBlock>
            </v-col>
            <v-col style="padding-top: 75px;">
              <company-card
                :program="program"
              />
            </v-col>
          </v-row>

          <BaseMasterFieldBlock
            title="Выпуск карты"
          >
            <span
              slot="description"
            >Хотите ли вы дать вашим клиентам возможность выпускать карту самостоятельно в приложении? Если выключить параметр, то карту сможет выпустить только ваш сотрудник.</span>
            <template v-slot:input>
              <base-ext-switch
                v-model="program.allow_issue"
                label="Разрешить самостоятельный выпуск карты"
              />
            </template>
          </BaseMasterFieldBlock>

          <v-row>
            <v-col>
              <v-btn
                :disabled="!valid"
                color="primary"
                class="master-next-btn"
                @click="onNextClick"
              >
                Далее
                <v-icon right>
                  mdi-arrow-right
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
  import { mapGetters } from 'vuex'

  export default {
    components: {
      CompanyCard: () => import('@/components/dialogs/CompanyCard'),
    },
    model: {
      prop: 'program',
      event: 'change',
    },
    props: {
      program: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {

        formValid: false,

      }
    },
    computed: {
      valid () {
        return this.formValid && this.program.logo
      },
    },
    created () {

    },
    methods: {
      onNextClick () {
        if (this.$refs.form.validate()) {
          this.$emit('continue', true)
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
@import 'master-style.scss';
@import '@/views/dashboard/form_component/_form-component.scss';
</style>

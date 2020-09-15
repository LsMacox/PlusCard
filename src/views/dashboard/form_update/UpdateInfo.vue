<template>
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      <v-form
        ref="form"
        v-model="valid"
        style="max-width: 676px;"
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
              :rules="nameRules"
              placeholder="Название компании"
              outlined
              counter
              minlength="1"
              maxlength="20"
            />
          </template>
        </BaseMasterFieldBlock>

        <v-row>
          <v-col>
            <BaseMasterFieldBlock
              title="Карта клиента"
            >
              <span
                slot="description"
              >Вот так будет выглядеть ваша карта в приложении. Измените цвет карты кликнув на ней и загрузите логотип, кликнув по иконке.</span>
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
            <v-switch
              v-model="program.allow_issue"
              inset
              label="Разрешить самостоятельный выпуск карты"
            />
          </template>
        </BaseMasterFieldBlock>

        <div style="margin: 68px 0;">
          <v-btn
            color="primary"
            :loading="loading"
            :disabled="!program.name || !program.logo"
            @click="updateCompany()"
          >
            <v-icon style="margin-right: 10px;">
              $iconify_ion-checkmark-circle-outline
            </v-icon>
            Сохранить
          </v-btn>
        </div>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
  import CompanyCard from '@/components/dialogs/CompanyCard'

  export default {
    components: {
      CompanyCard,
    },
    data () {
      return {
        loading: false,
        program: {
          name: null,
          logo: null,
          color: null,
          allow_issue: false,
        },
        valid: false,
        nameRules: [(value) => !!value || 'Введите название'],
        rules: {
          required: value => !!value || this.$t('required'),
          counter: value => value.length <= 20 || 'Max 20 characters',
        },
      }
    },
    computed: {
      programModel () {
        return this.$store.getters['company/program/programModel']
      },
    },
    created () {
      this.program = JSON.parse(JSON.stringify(this.programModel))
    },
    methods: {
      async updateCompany () {
        try {
          this.loading = true
          const item = {
            id: this.program.id,
            name: this.program.name,
            logo: this.program.logo,
            color: this.program.bgcolor1,
            allow_issue: this.program.allow_issue,
          }
          // console.log(item)
          await this.$store.dispatch('company/program/updateInfo', item)
        } finally {
          this.loading = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
@import 'form-update.scss';
</style>

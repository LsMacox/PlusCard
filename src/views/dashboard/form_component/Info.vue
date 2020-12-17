<template>
  <div>
    <v-row v-if="program.current_moderations && program.current_moderations.length">
      <v-col>
        <base-banner
          text="Ваша компания находится на модерации. Вы можете менять данные сколько угодно раз. Модерацию будут проходить самые свежие изменения. "
          type="warn"
          closeable
        />
      </v-col>
    </v-row>

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
  </div>
</template>

<script>
  import CompanyCard from '@/components/dialogs/CompanyCard'

  export default {
    components: {
      CompanyCard,
    },
    props: {
      program: {
        type: Object,
        default: function () {
          return {}
        },
      },
    },
    data () {
      return {}
    },
  }
</script>

<style lang="scss" scoped>
@import 'form-component.scss';
</style>

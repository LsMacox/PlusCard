<template lang="">
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <BaseMasterFieldBlock
          title="sd"
          describe="sdfsd"
          :horisontal="true"
        >
          <span slot="describe">Введите общее название сертификата. Оно будет отображаться на карточке сертификата в приложении Plus Cards</span>
          <template v-slot:input>
            <div>
              <v-text-field
                v-model="value.name"
                :validate-on-blur="true"
                :rules="nameRules"
                placeholder="Название сертификата"

                outlined
                counter="30"
                maxlength="30"
              />
            </div>
          </template>
        </BaseMasterFieldBlock>
        <v-btn
          color="primary"
          @click="onNextClick"
        >
          Далее
          <v-icon right>
            mdi-arrow-right
          </v-icon>
        </v-btn>
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    props: {
      value: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        valid: false,
      }
    },
    computed: {},
    created () {},
    methods: {
      onNextClick () {
        if (this.$refs.form.validate()) {
          this.$emit('continue', true)
        }
      },
    },
  }
</script>

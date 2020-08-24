<template>
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
          title="Название сертификата"
          :horisontal="true"
        >
          <span
            slot="describe"
          >Введите общее название сертификата. Оно будет отображаться на карточке сертификата в приложении Plus Cards</span>
          <template v-slot:input>
            <v-text-field
              v-model="value.name"
              :validate-on-blur="true"
              :rules="nameRules"
              placeholder="Название сертификата"
              outlined
              counter="30"
              maxlength="30"
            />
          </template>
        </BaseMasterFieldBlock>

        <BaseMasterFieldBlock title="Категория">
          <span
            slot="describe"
          >Выберите до 3-х категорий сертификата, в которых он будет отображаться в приложении</span>
          <template v-slot:input>
            <v-select
      v-model="value.category_id_list"
      :items="category_id_list"
      placeholder="Выберите категории"
      item-value="id"
      item-text="name"
      outlined
      multiple
      chips
      :ripple="false"
    >     
    </v-select>            
           
          </template>
        </BaseMasterFieldBlock>

        <BaseMasterFieldBlock title="Ключевые слова">
          <span slot="describe">
            Введите ключевые слова, по которым можно будет искать ваш сертификат.
            Клиенты ищут не только по названию компании, но и по ключевым словам
          </span>
          <template v-slot:input>
              <v-autocomplete
      v-model="value.tags"
      :items="tags_id_list"
      placeholder="Выберите ключевые слова"
      item-value="id"
      item-text="name"
      outlined
      multiple
      chips
      deletable-chips
      :ripple="false"
    >
     
    </v-autocomplete>            
           
          </template>
        </BaseMasterFieldBlock>

        <BaseMasterFieldBlock title="Описание сертификата">
          <span slot="describe">
            Заинтересуйте клиента своим сертификатом
            <br>Почему он должен купить именно этот, а не любой другой
          </span>
          <template v-slot:input>
            <v-textarea
              v-model="value.name"
              :validate-on-blur="true"
              :rules="nameRules"
              placeholder="Введите описание сертификата"
              outlined
              counter="255"
              maxlength="255"
            />
          </template>
        </BaseMasterFieldBlock>

        <v-row>
          <v-col>
            <v-btn
              color="primary"
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
      
    </v-row>
    {{ category_id_list }}
      {{ tags_id_list }}
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'

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
        GetCategoryListLoading: false,
        GetTagsListLoading: false,
        rules: {
          required: (value) => !!value || this.$t('required'),
          counter: (value) => value.length <= 20 || 'Max 20 characters',
        },
        nameRules: [(value) => !!value || 'Введите название'],
        categoryRules: [],
      }
    },
    computed: {
      ...mapGetters('certificates/certificate', [
        'category_id_list',
        'tags_id_list',
      ]),
    },
    created () {
      this.loadData()
    },
    methods: {
      loadData () {
        this.GetCategoryListLoading = true
        this.$store
          .dispatch('certificates/certificate/GetCategoryList')
          .finally(() => {
            this.GetCategoryListLoading = false
          })
        this.GetTagsListLoading = true
        this.$store
          .dispatch('certificates/certificate/GetTagsList')
          .finally(() => {
            this.GetTagsListLoading = false
          })
      },
      onNextClick () {
        if (this.$refs.form.validate() || true) {
          this.$emit('continue', true)
        }
      },
    },
  }
</script>

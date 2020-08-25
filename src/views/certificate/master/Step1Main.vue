<template>
  <v-container>
    <v-row
      align="center"
      justify="center"
    >    
      <v-form
        ref="form"
        v-model="valid"       
      >
        <BaseMasterFieldBlock
          title="Название сертификата"
          :horisontal="true"
        >
          <span
            slot="description"
          >Введите общее название сертификата. Оно будет отображаться на карточке сертификата в приложении Plus Cards</span>
          <template v-slot:input>
            <v-text-field
              v-model="cert.name"
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
            slot="description"
          >Выберите до 3-х категорий сертификата, в которых он будет отображаться в приложении</span>
          <template v-slot:input>
            <v-select
              v-model="cert.category_id_list"
              :items="category_id_list"
              :rules="categoryRules"
              placeholder="Выберите категории"
              item-value="id"
              item-text="name"
              outlined
              multiple
              chips
              deletable-chips
              :ripple="false"
            />
          </template>
        </BaseMasterFieldBlock>

        <BaseMasterFieldBlock title="Ключевые слова">
          <span slot="description">
            Введите ключевые слова, по которым можно будет искать ваш сертификат.
            Клиенты ищут не только по названию компании, но и по ключевым словам
          </span>
          <template v-slot:input>
            <v-combobox
              v-model="cert.tags"
              placeholder="Выберите ключевые слова"
              :items="tags_id_list"
               :rules="tagsRules"
              :search-input.sync="tagSearch"
              :return-object="false"
              hide-selected
              hint=""
              label=""
              no-data-text=""
              item-value="name"
              item-text="name"
              multiple
              persistent-hint
              chips
              outlined
              deletable-chips
              clearable
            >
              <template v-slot:no-data>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title>
                      Нет ключевых слов соотвествующих поиску "<strong>{{ tagSearch }}</strong>". Нажмите <kbd>Enter</kbd> для добавления нового слова
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-combobox>           
          </template>
        </BaseMasterFieldBlock>

        <BaseMasterFieldBlock title="Описание сертификата">
          <span slot="description">
            Заинтересуйте клиента своим сертификатом
            <br>Почему он должен купить именно этот, а не любой другой
          </span>
          <template v-slot:input>
            <v-textarea
              v-model="cert.description"
              :validate-on-blur="true"
              :rules="descriptionRules"
              :rows="1"
              auto-grow
              placeholder="Введите описание сертификата"
              outlined
              maxlength="255"
            />
          </template>
        </BaseMasterFieldBlock>

        <v-row>
          <v-col>
            <v-btn
              v-show="valid"
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
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    model: {
      prop: 'cert',
      event: 'change',
    },
    props: {
      cert: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {
        tagSearch: null,
        valid: false,
        GetCategoryListLoading: false,
        GetTagsListLoading: false,
        rules: {
          required: (value) => !!value || this.$t('required'),
          counter: (value) => value.length <= 20 || 'Max 20 characters',
        },
        nameRules: [(value) => !!value || 'Введите название'],
        categoryRules: [
          (v) => !!v || 'Выберите категории',
          (v) => (v.length >= 1 && v.length <= 3) || 'Выберите от 1 до 3 категорий',
        ],
        tagsRules: [
          (v) => !!v || 'Выберите ключевые слова',
        ],
        descriptionRules: [
           (v) => !!v || 'Введите описание',
        ],
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
        // this.value = null
        if (this.$refs.form.validate()) {
          this.$emit('continue', true)
        }
      },
    },
  }
</script>
<style lang="scss" scoped>
@import 'master-style.scss';
</style>

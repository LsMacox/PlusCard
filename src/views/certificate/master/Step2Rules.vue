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
          title="Правила использования"
        >
          <span slot="description">Детально опишите условия использования сертификата, правила его активации, а также укажите места, где можно использовать сертификат.</span>
          <template v-slot:input>
            <div>
              <editor
                v-model="cert.terms_of_use"
                api-key=""
                output-format="html"
                :init="{
                  height: 264,
                  language: 'ru',
                  menubar: false,
                  plugins: [
                    'advlist autolink lists link image charmap print preview anchor',
                    'searchreplace visualblocks code fullscreen',
                    'insertdatetime media table paste code help wordcount'
                  ],
                  toolbar:
                    'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | help'
                }"
              />
            </div>
          </template>
        </BaseMasterFieldBlock>
        <v-row>
          <v-col>
            <v-radio-group
              v-model="cert.certificate_usage_type"
              row
            >
              <v-radio
                label="Можно использовать везде"
                value="Everywhere"
              />
              <v-radio
                label="В интернет-магазине"
                value="OnlineStoreOnly"
              />
              <v-radio
                label="В офлайн магазине"
                value="OfflineStoreOnly"
              />
            </v-radio-group>
          </v-col>
        </v-row>
        <BaseMasterFieldBlock
          title="Срок годности"
        >
          <span slot="description">Это срок в течении которого нужно активировать сертификат после покупки, чтобы он не сгорел. Если ваш сертификат можно использовать в течении неограниченного колличества времени - не выключайте это поле</span>
          <template v-slot:input>
            <v-row>
              <v-switch
                v-model="cert.guaranteed_period_unlimit"
                label="Неограниченный"
                @change="periodUnlimitChange"
              />
              <div :style="{width: '136px', 'margin-left': '20px'}">
                <v-text-field
                  v-show="!cert.guaranteed_period_unlimit"
                  :value="cert.guaranteed_period + ' мес'"
                  :append-outer-icon="'mdi-plus'"
                  :prepend-icon="'mdi-minus'"
                   type="text"
                  outlined
                  readonly
                  @click:append-outer="cert.guaranteed_period++"
                  @click:prepend="cert.guaranteed_period--"
                />
              </div>
            </v-row>
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
  </v-container>
</template>

<script>
  import Editor from '@tinymce/tinymce-vue'

  export default {
    model: {
      prop: 'cert',
      event: 'change',
    },
    components: {
      editor: Editor,
    },
    props: {
      cert: {
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
      periodUnlimitChange () {
        this.cert.guaranteed_period = (this.cert.guaranteed_period_unlimit ? null : 1)
      },
      onNextClick () {
        if (this.$refs.form.validate()) {
          this.$emit('continue', true)
        }
      },
    },
  }
</script>

<style lang="scss">
.tox-notification {
  display: none !important;
}
</style>

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
            <div id="cert-term-use-editor">
              <editor
                v-model="cert.terms_of_use"
                api-key=""
                output-format="html"
                :init="{
                  height: 264,
                  language: 'ru',
                  menubar: false,
                  statusbar: false,
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
              <v-alert
                v-show="!termsUserValid"
                type="error"
                dense
                text
              >
                Правила использования обязательно для заполнения
              </v-alert>
            </div>
          </template>
        </BaseMasterFieldBlock>
        <v-row>
          <v-col class="pt-0">
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
              <v-col cols="auto">
                <v-switch
                  v-model="cert.guaranteed_period_unlimit"
                  :style="{height: '86px'}"
                  label="Неограниченный"
                  @change="periodUnlimitChange"
                />
              </v-col>
              <v-col cols="auto">
                <v-text-field
                  v-show="!cert.guaranteed_period_unlimit"
                  :value="cert.guaranteed_period + ' мес'"
                  :style="{width: '136px', 'margin-left': '20px'}"
                  type="text"
                  outlined
                  readonly
                >
                  <template v-slot:prepend>
                    <v-icon
                      color="primary"
                      @click="cert.guaranteed_period = (cert.guaranteed_period > 0 ? cert.guaranteed_period-1 : 0)"
                    >
                      mdi-minus
                    </v-icon>
                  </template>
                  <template v-slot:append-outer>
                    <v-icon
                      color="primary"
                      @click="cert.guaranteed_period++"
                    >
                      mdi-plus
                    </v-icon>
                  </template>
                </v-text-field>
              </v-col>
            </v-row>
          </template>
        </BaseMasterFieldBlock>        
      </v-form>
    </v-row>
  </v-container>
</template>

<script>
  import Editor from '@tinymce/tinymce-vue'

  export default {
    components: {
      editor: Editor,
    },
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
        termsUserValid: true,
        valid: false,
      }
    },
    computed: {
      formValid () {
        return this.valid && this.termsUserValid
      },
    },
    watch: {
      'cert.terms_of_use': function (v) {
        if (v) this.termsUserValid = true
      },
    },
    created () {},
    methods: {
      validate () {
        return this.$refs.form.validate() && this.termsUserValidate()
      },
      periodUnlimitChange () {
        this.cert.guaranteed_period = this.cert.guaranteed_period_unlimit
          ? null
          : 1
      },
      termsUserValidate () {
        this.termsUserValid = !!this.cert.terms_of_use
        return this.termsUserValid
      },     
    },
  }
</script>

<style lang="scss">
.tox-notification {
  display: none !important;
}
#cert-term-use-editor {
  .tox.tox-tinymce {
    border: 1px solid #d7d7e0;
    border-radius: 12px;
    .tox-toolbar__primary{
      border-bottom: 1px solid #d7d7e0;
      background: none;
      .tox-toolbar__group{
       border-color: #d7d7e0;
    }
    }

  }
}
</style>
<style lang="scss" scoped>
@import "master-style.scss";
</style>

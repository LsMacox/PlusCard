<template>
  <div class="pls--pushcon-block-button">
    <div
      class="pls--pushcon-block-button-btn"
      :style="`background-color: ${localBlock.color}`"
      @click.stop="updateBtn = true"
    >
      {{ localBlock.text }}
    </div>
    <!-- боковая панель -->
    <div
      class="crm"
      style="text-align: left;"
    >
      <side-panel
        v-model="updateBtn"
        :width="483"
        class="panel-crm panel-crm_new_client"
        hide-overlay
      >
        <div class="panel-crm__header panel-crm_new_client__header">
          <h1
            class="panel-crm__header-title panel-crm_new_client__title title-m-bold"
          >
            Редактирование блока "Кнопка"
          </h1>
        </div>
        <div class="panel-crm__body panel-crm_new_client__body">
          <v-form
            ref="panel-crm_new_client__form"
            v-model="valid"
            class="panel-crm_new_client__form"
          >
            <div class="panel-crm_segment__form-block">
              <v-row>
                <v-col
                  cols="12"
                  style="height: 65px"
                >
                  <v-select
                    v-model="localBlock.color"
                    :items="colors"
                    placeholder="Тип кнопки"
                    outlined
                  />
                </v-col>
                <v-col
                  cols="12"
                  style="height: 65px"
                >
                  <v-text-field
                    v-model="localBlock.text"
                    :rules="[
                      v => String(v).length <= 50 || 'Фамилия должна быть не более 50 символов',
                    ]"
                    class="panel-crm__form-input panel-crm_new_client__form-input"
                    type="text"
                    placeholder="Текст кнопки"
                    outlined
                  />
                </v-col>
                <v-col
                  cols="12"
                  style="height: 65px"
                >
                  <v-select
                    v-model="localBlock.broadcaster_id"
                    class=""
                    :items="broadcasterAccountPickList"
                    item-text="name"
                    item-value="id"
                    placeholder="Выберите активность"
                    outlined
                    :rules="[
                      v => !!v || 'Выберите активность',
                    ]"
                    :loading="getBroadcasterPickListAction"
                  />
                  <v-text-field v-if="false"
                    v-model="localBlock.action"
                    :rules="[
                      v => String(v).length <= 50 || 'Фамилия должна быть не более 50 символов',
                    ]"
                    class="panel-crm__form-input panel-crm_new_client__form-input"
                    type="text"
                    placeholder="Действие"
                    outlined
                  />
                </v-col>
                <v-col cols="12">
                  <v-btn
                    class="panel-crm_new_client__btn-add-client"
                    color="primary"
                    :disabled="!valid"
                    @click="updateBtn = false"
                  >
                    <iconify-icon
                      class="icon-check-circle"
                      icon="check-circle"
                      height="21"
                    />
                    <p class="body-m-semibold neutral-100--text">
                      Сохранить
                    </p>
                  </v-btn>
                </v-col>
              </v-row>
            </div>
          </v-form>
        </div>
      </side-panel>
    </div>
  </div>
</template>

<script>
  import SidePanel from '@/components/base/SidePanel'
  import BlockMixin from './blockMixin'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    components: {
      SidePanel,
    },
    mixins: [BlockMixin],
    props: {
      block: {
        type: Object,
        default: () => ({}),
      },
    },
    data () {
      return {
        localBlock: {},
        updateBtn: false,
        valid: false,
        getBroadcasterPickListAction: false,
        colors: [
          { value: 'blue', text: 'Синий' },
          { value: 'red', text: 'Красный' },
        ],
      }
    },
    computed: {
      ...mapGetters('company/event_broadcasters', ['broadcasterAccountPickList']),
      ...mapGetters(['programId']),
    },
    watch: {
      block: {
        handler (v) {
          if (!this.objectComparison(v, this.localBlock)) this.initBlock(v)
        },
        deep: true,
      },
      localBlock: {
        handler (v) {
          this.updateBlock(v)
        },
        deep: true,
      },
    },
    created () {
      this.initBlock(this.block)
      this.loadBroadcasterPickList()
    },
    methods: {
      ...mapActions({
        GetBroadcasterPickList: 'company/event_broadcasters/GetPickList',
      }),
      async loadBroadcasterPickList () {
        try {
          this.getBroadcasterPickListAction = true
          await this.GetBroadcasterPickList(this.programId)
        } catch (e) {
          console.error(e)
        } finally {
          this.getBroadcasterPickListAction = false
        }
      },

    },
  }
</script>

<style lang="scss" scoped>
@import "@/styles/pls/content-constructor/_constructor.scss";
@import "@/styles/vuetify-preset-plus/light_theme/crm/_crm.scss";
</style>

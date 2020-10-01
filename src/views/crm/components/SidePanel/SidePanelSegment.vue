<template>
  <side-panel
    v-model="state"
    :width="483"
    class="panel-crm panel-crm_segment"
  >
    <div class="panel-crm__header panel-crm_segment__header">
      <h1 class="panel-crm__header-title panel-segment__title title-m-bold">
        <template v-if="mode == 'create'">
          Новый сегмент клиентов
        </template>
        <template v-if="mode == 'edit'">
          Редактирование сегмента
        </template>
      </h1>
    </div>
    <div class="panel-crm__body panel-crm_segment__body">
      <v-form
        ref="panel-crm_segment__form"
        class="panel-crm_segment__form"
      >
        <div class="panel-crm_segment__form-block">
          <div class="panel-crm_segment__form-labels">
            <p class="body-l-semibold">
              Название сигмента
            </p>
            <p class="labels__sub-label body-m-regular">
              Это название будет использоваться во всех
              уведомлениях, таблицах и пр.
            </p>
          </div>
          <v-text-field
            v-if="mode == 'create'"
            v-model="createData.name"
            :rules="rules.name"
            class="panel-crm__form-input panel-crm_segment__form-input"
            type="text"
            placeholder="Введите название сигмента"
            outlined
          />
          <v-text-field
            v-if="mode == 'edit'"
            v-model="editData.name"
            :rules="rules.name"
            class="panel-crm__form-input panel-crm_segment__form-input"
            type="text"
            placeholder="Введите название сигмента"
            outlined
          />
        </div>
        <div class="panel-crm_segment__form-block">
          <div class="panel-crm_segment__form-labels">
            <p class="body-l-semibold">
              Описание сегмента
            </p>
            <p class="labels__sub-label body-m-regular">
              Развернутое описание сегмента клиентов.
            </p>
          </div>
          <div class="panel-crm_segment__form-textarea">
            <v-textarea
              v-if="mode == 'create'"
              v-model="createData.description"
              :rules="rules.description"
              class="panel-crm__form-input panel-crm_segment__form-input"
              rows="4"
              placeholder="Введите название сигмента"
              outlined
              auto-grow
            />
            <v-textarea
              v-if="mode == 'edit'"
              v-model="editData.description"
              :rules="rules.description"
              class="panel-crm__form-input panel-crm_segment__form-input"
              rows="4"
              placeholder="Введите название сигмента"
              outlined
              auto-grow
            />
            <div class="textarea---angle" />
          </div>
        </div>
        <div class="panel-crm_segment__form-block">
          <div class="panel-crm_segment__form-labels">
            <p class="body-l-semibold">
              Цвет сегмента
            </p>
            <p class="labels__sub-label body-m-regular">
              Выберите цвет сегмента, чтобы вы могли быстро идентифицировать его среди остальных.
            </p>
            <div
              class="labels__color-picker"
            >
              <div
                class="labels__color-box"
                :style="mode == 'create' ? `background: ${createData.color};` : `background: ${editData.label_color};`"
                @click="colorPickerShow = !colorPickerShow"
              />
              <div
                v-show="colorPickerShow"
                class="colorPickerWrapper"
              >
                <v-color-picker
                  v-if="mode == 'create'"
                  v-model="createData.color"
                  class="color-picker pa-2"
                  hide-mode-switch
                  mode="hexa"
                  flat
                  @input="changeColor"
                />
                <v-color-picker
                  v-if="mode == 'edit'"
                  v-model="editData.label_color"
                  class="color-picker pa-2"
                  hide-mode-switch
                  mode="hexa"
                  flat
                  @input="changeColor"
                />
              </div>
            </div>
          </div>
        </div>
        <div
          class="panel-crm_segment__btns"
        >
          <v-btn
            v-if="btnCreateShow"
            class="panel-crm_segment__btn-create"
            color="primary"
            @click="addSegment"
          >
            <iconify-icon
              class="icon-check-circle"
              icon="check-circle"
              height="21"
            />
            <template v-if="mode == 'create'">
              Создать сегмент
            </template>
            <template v-if="mode == 'edit'">
              Сохранить сегмент
            </template>
          </v-btn>
          <div
            v-if="mode == 'edit'"
            class="panel-crm_segment__btn-delete"
            @click="deleteSegment"
          >
            <iconify-icon
              class="icon-feather-trash"
              icon="feather-trash"
              width="21"
            />
            <p class="body-s-semibold error--text">
              Удалить сегмент
            </p>
          </div>
        </div>
      </v-form>
    </div>
  </side-panel>
</template>

<script>
  import Convertor from '@/mixins/convertor.js'
  import SidePanel from '@/components/base/SidePanel'

  export default {
    components: {
      SidePanel,
    },
    mixins: [Convertor],
    model: {
      prop: 'active',
      event: 'changeState',
    },
    props: {
      mode: {
        type: String,
        default: 'create', // and edit
      },
      tableData: {
        type: Object,
        default: function () {
          return {}
        },
      },
      active: {
        type: Boolean,
      },
    },
    data () {
      return {
        state: this.active,
        colorPickerShow: false,
        createData: this.getDefaultCreateData(),
        editData: this.getDefaultEditData(),
        btnCreateShow: false,
        rules: {
          name: [v => !!v || 'Заполните поле'],
          description: [v => !!v || 'Заполните поле'],
        },
      }
    },
    computed: {
      segmentData () {
        let data

        if (this.mode === 'edit') {
          data = {
            id: this.editData.id,
            data: this.editData,
          }
        } else if (this.mode === 'create') {
          data = this.createData
        }

        return data
      },
    },
    watch: {
      active () {
        this.state = this.active
      },
      state () {
        this.createData = this.getDefaultCreateData()
        this.editData = this.getDefaultEditData()
        this.$emit('changeState', this.state)
      },
      mode () {
        if (this.mode === 'edit') this.btnCreateShow = true
      },
    },
    created () {
      document.addEventListener('click', (event) => {
        let isClose = true
        event.path.forEach((dom) => { if (dom.className === 'labels__color-picker') { isClose = false } })
        if (isClose) this.closePicker()
      })
    },
    mounted () {
      if (this.mode === 'edit') this.btnCreateShow = true

      this.$watch(
        () => {
          return this.$refs['panel-crm_segment__form'].validate()
        },
        (isValid) => {
          if (this.mode === 'create' && isValid) this.btnCreateShow = true
          else if (this.mode === 'create' && !isValid) this.btnCreateShow = false
        },
      )
    },
    methods: {
      changeColor (str) {
        if (this.mode === 'create') {
          this.createData.color = str
        } else if (this.mode === 'edit') {
          this.editData.color = str
        }
      },
      getDefaultEditData () {
        return this.tableData
          ? Object.assign({}, this.tableData)
          : []
      },
      getDefaultCreateData () {
        return {
          name: '',
          description: '',
          color: '#16BF12',
        }
      },
      closePicker () {
        this.colorPickerShow = false
      },
      async addSegment () {
        const valid = this.$refs['panel-crm_segment__form'].validate()

        if (valid) {
          if (this.mode === 'create') {
            this.$store.dispatch('crm/segment/createSegment', this.segmentData)
          } else if (this.mode === 'edit') {
            this.$store.dispatch('crm/segment/editSegment', this.segmentData)
          }
          this.state = false
        }
      },
      deleteSegment () {
        this.$store.dispatch('crm/segment/deleteSegment', this.segmentData.id)
        this.state = false
      },
    },
  }
</script>

<style lang="scss" scoped>

@import "@/styles/vuetify-preset-plus/light_theme/crm/components/side_panels/_side-panel-segment.scss";

</style>

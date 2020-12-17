<template>
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      <v-col>
        <v-form
          ref="form"
          v-model="formValid"
        >
          <BaseMasterFieldBlock
            title="Название активности"
            description="Это название будет использоваться в отчетах о работе активности"
          >
            <template v-slot:input>
              <base-text-field
                v-model="model.name"
                :validate-on-blur="true"
                placeholder="Название активности"
                outlined
                counter
                minlength="1"
                maxlength="255"
                :rules="[
                  v => !!v || 'Название обязательно',
                  v => v.length <= 255 || 'Название не должно быть более 255 символов'
                ]"
              />
            </template>
          </BaseMasterFieldBlock>

          <BaseMasterFieldBlock
            title="Время работы процесса"
            description="После окончания указанного периода времени, активность самостоятельно отключится."
          >
            <template v-slot:input>
              <v-row>
                <v-col>
                  <base-date-text-field
                    :date.sync="model.start_at"
                    date-format="DD.MM.YYYY HH:mm:ss"
                    class="date-start"
                    placeholder="Дата и время начала работы"
                    :rules="[
                      v => validateDates(v),
                    ]"
                    time-picker
                  />
                </v-col>
                <v-col>
                  <base-date-text-field
                    :date.sync="model.finish_at"
                    date-format="DD.MM.YYYY HH:mm:ss"
                    class="date-start"
                    placeholder="Дата и время окончания работы"
                    :rules="[
                      v => validateDates(v),
                    ]"
                    time-picker
                  />
                </v-col>.
              </v-row>
            </template>
          </BaseMasterFieldBlock>

          <BaseMasterFieldBlock
            title="Описание"
            description="Описание октивности позволяет сделать пояснение для сотрудников, какие действия будут выполняться в результате работы активности. Клиенты этот тект не видят."
          >
            <template v-slot:input>
              <v-textarea
                v-model="model.description"
                :validate-on-blur="true"
                :rules="[
                  (v) => (!v || v.length <= 10000) || 'Описание не превышает 10000',
                ]"
                :rows="2"
                auto-grow
                placeholder="Введите описание активности"
                outlined
                maxlength="10000"
              />
            </template>
          </BaseMasterFieldBlock>

          <BaseMasterFieldBlock
            title="Режим запуска"
            description="Выберите один из режимов запуска активности и настройте её параметры."
          >
            <template v-slot:input>
              <v-row>
                <v-col>
                  <v-radio-group
                    v-model="emitMode"
                    class="mt-0"
                    hide-details
                    row
                  >
                    <v-radio
                      v-for="item in emitModeList"
                      :key="item.id"
                      :label="item.text"
                      :value="item.id"
                    />
                  </v-radio-group>
                </v-col>
              </v-row>
              <v-row v-if="emitModeObject && emitModeObject.comment">
                <v-col cols="auto">
                  <v-icon>$iconify_feather-info</v-icon>
                </v-col>
                <v-col class="body-m-regular neutral-600--text">
                  {{ emitModeObject.comment }}
                </v-col>
              </v-row>
              <v-row
                v-if="emitMode=== ProgramEventBroadcaster.EMIT_MODE_ENUM.EVENT.id "
                align="center"
              >
                <v-col>
                  <v-select
                    v-model="model.listen_event"
                    :loading="GetEventListAction"
                    class=""
                    :items="accountEventPickList"
                    item-text="name"
                    item-value="id"
                    placeholder="Выберите событие"
                    outlined
                    :rules="[
                      v => !!v || 'Выберите событие',
                    ]"
                  />
                </v-col>
              </v-row>
              <v-row
                v-if="emitMode=== ProgramEventBroadcaster.EMIT_MODE_ENUM.PERIOD.id && model.period "
                align="center"
              >
                <v-col cols="auto">
                  Запускать процесс каждые
                </v-col>
                <v-col cols="auto">
                  <base-text-field
                    v-model.number="model.period.value"
                    :validate-on-blur="true"
                    :style="{width: '72px'}"
                    :key-filter-regexp="/(\d|Delete|Backspace|Enter)/"
                    outlined
                    :rules="[
                      v => !!v || 'обязательно',
                    ]"
                  />
                </v-col>
                <v-col cols="auto">
                  <v-select
                    v-model="model.period.type"
                    :style="{width: '150px'}"
                    class=""
                    :items="periodTypeList"
                    item-text="text"
                    item-value="id"
                    placeholder="Период"
                    outlined
                    hide-details=""
                    :rules="[
                      v => !!v || 'Выберите периодичность',
                    ]"
                  />
                </v-col>
              </v-row>
            </template>
          </BaseMasterFieldBlock>

          <v-row>
            <v-col>
              <v-btn
                v-show="actionShow"
                :disabled="!formValid"
                color="primary"
                class="master-next-btn"
                :loading="actionLoading"
                @click="onNextClick"
              >
                {{ actionText }}
                <v-icon
                  v-if="!!actionIcon"
                  :rigth="!actionLeft"
                >
                  {{ actionIcon }}
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
  import { mapGetters, mapActions } from 'vuex'

  import ProgramEventBroadcaster from '@/models/program/broadcaster'

  export default {
    components: {

    },
    model: {
      prop: 'model',
      event: 'change',
    },
    props: {
      model: {
        type: Object,
        required: true,
      },
      actionText: {
        type: String,
        default: 'Далее',
      },
      actionLeft: Boolean,
      actionIcon: {
        type: String,
        default: 'mdi-arrow-right',
      },
      actionLoading: Boolean,
      actionShow: {
        type: Boolean,
        default: true,
      },
    },
    constants: {
      ProgramEventBroadcaster,
      periodTypeList: ProgramEventBroadcaster.PERIOD_ENUM.toList(),
      accountEventList: [
        { id: 'id', text: 'text' },
      ],
    },
    data () {
      return {
        formValid: false,
        GetEventListAction: false,
        emitModeList: [
          {
            id: ProgramEventBroadcaster.EMIT_MODE_ENUM.MANUAL.id,
            text: 'Ручной запуск',
            comment: 'Режим ручного запуска необходим в том случае, когда сотрудник сам выбирает, когда необходимо выполнить активность. Активность будет выполняться только после нажатия кнопки "Выполнить" в списке активностей. При этом, если попытка запуска будет произведена не в преиод, указанный в настройках активности, то она не выполнится. Такие активности можно запускать многократно нажимая кнопку "Выполнить" в списке активностей.',
          },
          {
            id: ProgramEventBroadcaster.PERIOD_ENUM.ONCE.id,
            text: 'Единоразово',
            comment: 'В этом режиме активность выполнится один раз автоматически, когда наступит время начачла её работы. Если укзаннное время уже наступило, то такая активность будет запущена сразу после её ключения в списке.',
          },
          {
            id: ProgramEventBroadcaster.EMIT_MODE_ENUM.PERIOD.id,
            text: 'По расписанию',
            comment: 'Этот режим позволит запускать активность с заданным интервалом времени. Все запуски будут происходить при вклюении активности в списке и при условии попадания в интервал времени работы активности, указанный в её настройках.',
          },
          {
            id: ProgramEventBroadcaster.EMIT_MODE_ENUM.EVENT.id,
            text: 'По событию',
            comment: 'Такой режим позволит настроить запуск активности по возникновению события пользователя. Такая активность будет запущена только для того пользователя, у которого возникло собитие. В настройках запуска необходимо выбрать тип события, по котрому пудет произведен запуск.',
          },
          {
            id: ProgramEventBroadcaster.EMIT_MODE_ENUM.ACCOUNT.id,
            text: 'Запуск клиентом',
            comment: 'Такие активности запускаются только для клиентов нажавших кнопку в рассылке. Выбор запускаемой активности производится в настройках кнопки в шаблоне рассылки.',
          },
        ],
      }
    },
    computed: {
      ...mapGetters({
        accountEventPickList: 'company/event_broadcasters/accountEventPickList',
      }),

      emitModeObject () {
        return this.$_.findWhere(this.emitModeList, { id: this.emitMode })
      },

      emitMode: {
        get: function () {
          if (this.model.emit_mode === ProgramEventBroadcaster.EMIT_MODE_ENUM.PERIOD.id) {
            return this.model.period && this.model.period.type === ProgramEventBroadcaster.PERIOD_ENUM.ONCE.id
              ? ProgramEventBroadcaster.PERIOD_ENUM.ONCE.id : ProgramEventBroadcaster.EMIT_MODE_ENUM.PERIOD.id
          } else {
            return this.model.emit_mode
          }
        },
        set: function (v) {
          this.model.emit_mode = v
          if (v === ProgramEventBroadcaster.EMIT_MODE_ENUM.PERIOD.id) {
            this.model.period = {
              type: ProgramEventBroadcaster.PERIOD_ENUM.DAY.id,
              value: null,
            }
          } else if (v === ProgramEventBroadcaster.PERIOD_ENUM.ONCE.id) {
            this.model.emit_mode = ProgramEventBroadcaster.EMIT_MODE_ENUM.PERIOD.id
            this.model.period = {
              type: ProgramEventBroadcaster.PERIOD_ENUM.ONCE.id,
              value: null,
            }
          } else {
            this.model.period = null
          }
        },
      },
    },
    created () {
      this.loadEventList()
    },
    methods: {
      ...mapActions({
        GetEventList: 'company/event_broadcasters/GetEventList',
      }),

      validate () {
        return this.$refs.form.validate()
      },
      async loadEventList () {
        try {
          this.GetEventListAction = true
          await this.GetEventList()
        } catch (e) {
          console.error(e)
        } finally {
          this.GetEventListAction = false
        }
      },

      validateDates (v) {
        if (this.model.start_at && this.model.finish_at) {
          return this.$moment(this.model.start_at).diff(this.$moment(this.model.finish_at)) < 0 || 'Дата окончания должна быть больше начала'
        } else {
          return true
        }
      },
      onNextClick () {
        if (this.validate()) {
          this.$emit('continue', true)
        }
      },
    },
  }
</script>
<style lang="scss" scoped>

@import '@/views/dashboard/form_component/_form-component.scss';
</style>

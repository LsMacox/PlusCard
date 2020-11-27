<template>
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      <v-col cols="8">
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
            description="Укажите период запуска активности. После окончания указанного периода времени, процесс самостоятельно отключится."
          >
            <template v-slot:input>
              <v-row>
                <v-col>Дата и время начала работы</v-col>.
                <v-col>Дата и время окончания работы</v-col>.
              </v-row>
            </template>
          </BaseMasterFieldBlock>

          <BaseMasterFieldBlock
            title="Описание"
            description="TODO"
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
            description="Выберите один из режимов запуска бизнес-процесса и настройте его параметры. "
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
            </template>
          </BaseMasterFieldBlock>

          <v-row>
            <v-col>
              <v-btn
                :disabled="!formValid"
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
//   import { mapGetters } from 'vuex'

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
    },
    data () {
      return {

        formValid: false,
        emitModeList: [
          { id: ProgramEventBroadcaster.EMIT_MODE_ENUM.MANUAL.id, text: 'Ручной запуск' },
          { id: ProgramEventBroadcaster.PERIOD_ENUM.ONCE.id, text: 'Единоразово' },
          { id: ProgramEventBroadcaster.EMIT_MODE_ENUM.PERIOD.id, text: 'По расписанию' },
          { id: ProgramEventBroadcaster.EMIT_MODE_ENUM.EVENT.id, text: 'По событию' },
        ],

      }
    },
    computed: {

      emitMode: {
        get: function () { return this.model.emit_mode },
        set: function (v) { this.model.emit_mode = v },
      },
    },
    created () {

    },
    methods: {
      onNextClick () {
        if (this.$refs.form.validate()) {
          this.$emit('continue', true)
        }
      },
    },
  }
</script>
<style lang="scss" scoped>

@import '@/views/dashboard/form_component/_form-component.scss';
</style>

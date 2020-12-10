<template>
  <v-row>
    <v-col>
      <BaseDialogFieldBlock
        title="Сегмент"
        description=""
      >
        <v-select
          v-model="model.action_json.segment_id"
          class=""
          :items="pickSegments"
          item-text="name"
          item-value="id"
          placeholder="Выберите сегмент"
          outlined
          :rules="[
            v => !!v || 'Выберите сегмент',
          ]"
          :loading="getSegmenPickListAction||loading"
        />
      </BaseDialogFieldBlock>
    </v-col>
  </v-row>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import ProgramEventBroadcasterHandler from '@/models/program/broadcasterHandler'

  export default {
    components: {},
    model: {
      prop: 'model',
      event: 'update',
    },
    props: {
      model: {
        type: Object,
        required: true,
      },
      loading: {
        type: Boolean,
        default: false,
      },
    },
    constants: {
      actionTypeList: ProgramEventBroadcasterHandler.ACTION_ENUM.toList(),
      ACTION_ENUM: ProgramEventBroadcasterHandler.ACTION_ENUM,
    },
    data () {
      return {
        getSegmenPickListAction: false,
      }
    },
    computed: {
      ...mapGetters('crm/segment', ['pickSegments']),
    },
    mounted () {
      this.loadPickSegments()
    },
    methods: {
      ...mapActions({
        getSegmentPickList: 'crm/segment/getPickList',
      }),

      async loadPickSegments () {
        try {
          this.getSegmenPickListAction = true
          await this.getSegmentPickList(this.model.program_id)
        } catch (e) {
          console.error(e)
        } finally {
          this.getSegmenPickListAction = false
        }
      },

    },
  }
</script>

<style lang="scss" scoped>
</style>

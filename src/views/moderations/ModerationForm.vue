<template>
  <v-navigation-drawer
    v-model="drawer"
    fixed
    temporary
    right
    width="100%"
  >
    <template v-slot:prepend>
      <v-container class="dialog-header">
        <v-row>
          <v-col>
            <v-btn
              color="secondary"
              :text="true"
              :ripple="false"
              @click="close"
            >
              <img src="@/icons/svg/arrowBack.svg">
              Назад
            </v-btn>
            <!-- {{ moderationId }} {{ GetModerationAction }} -->
          </v-col>
        </v-row>
      </v-container>
    </template>

    <v-container class="dialog-body">
      <v-skeleton-loader
        :loading="GetModerationAction"
        :style="{height: '100%', width: '100%'}"
        type="image@3"
      >
        <div>
          <moderation-row
            v-for="field in fields"
            :key="field.id"
            :field="field"
            :entity-type="moderation.entity_type"
          />
          <v-row
            v-if="moderation"
            class="status-row"
          >
            <v-col>
              <moderation-status-label
                :status="moderation.status"
                :updated-at="moderation.updated_at"
                :message="moderation.message"
              />
            </v-col>
          </v-row>
        </div>
      </v-skeleton-loader>
    </v-container>
  </v-navigation-drawer>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'ModerationForm',
    components: {
      ModerationStatusLabel: () => import('./ModerationStatusLabel.vue'),
      ModerationRow: () => import('./ModerationFieldRow.vue'),
    },
    model: {
      prop: 'dialog',
      event: 'change',
    },
    props: {
      dialog: Boolean,
      moderationId: {
        type: Number,
        required: true,
      },
      programId: {
        type: Number,
        required: true,
      },
    },
    data () {
      return {
        drawer: true,
        GetModerationAction: false,

      }
    },
    computed: {
      ...mapGetters({
        moderations_full: 'company/moderations/moderations_full',

      }),
      moderation () {
        return this.moderations_full[this.moderationId]
      },
      fields () {
        return this.moderation ? this.moderation.fields : []
      },

    },
    watch: {
      drawer (v) { this.$emit('change', v) },
      dialog (v) { this.drawer = v },
    },

    mounted () {
      this.init()
    },

    methods: {
      ...mapActions({
        GetModeration: 'company/moderations/GetModeration',
      }),

      close () {
        this.drawer = false
      },

      async init () {
        if (this.moderation) return
        try {
          this.GetModerationAction = true
          // await this.$sleep()
          await this.GetModeration({ id: this.moderationId, programId: this.programId })
        } catch (error) {
          console.error(error)
        } finally {
          this.GetModerationAction = false
        }
      },
    },

  }
</script>
<style lang="scss" scoped>
$row-space: 7px;

.dialog-body, .dialog-header {
  padding-left: 34px;
  padding-right: 34px;
}

.dialog-header {
  padding-top: 24px;
  padding-bottom: 24px;
}

.dialog-body{
  padding-bottom: 24px;

  margin-top: -$row-space;
  margin-bottom: -$row-space;

}

.field-row {
  margin-top: $row-space;
  margin-bottom: $row-space;
  // margin-top: 25px;
  .field-title {
    padding-top: 24px;
    padding-bottom: 24px;
  }
}

.status-row {
   margin-top: $row-space;
  margin-bottom: $row-space;
}
</style>

<template>
  <div class="loyalty-toolbar">
    <div class="loyalty-toolbar-name">
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <div
            v-bind="attrs"
            v-on="on"
          >
            {{ program.name }}
          </div>
        </template>
        <span> {{ program.name }} </span>
      </v-tooltip>
    </div>
    <div class="loyalty-toolbar-period">
      <date-range-select
        min-width="250px"
        :items="periods"
        :model.sync="periodId"
        item-value="id"
        item-label="name"
      />
    </div>
    <div class="loyalty-toolbar-name-hint">
      <div
        v-if="(program.current_moderations && program.current_moderations.length)"
        class="loyalty-toolbar-name-hint-green"
      >
        на модерации
      </div>
      <div
        v-if="program.moderation_status === 'REJECT'"
        class="loyalty-toolbar-name-hint-red"
      >
        модерация отклонена
      </div>
    </div>

    <div class="app__spacer" />

    <div style="display: flex;">
      <v-btn
        v-if="program.moderation_status === 'TEMPLATE' && (program.current_moderations && !program.current_moderations.length)"
        color="secondary"
        style="position: relative; top: 10px; right: 16px;"
        :text="true"
        :ripple="false"
        :loading="loading"
        @click="setModeration()"
      >
        <span
          class="iconify"
          style="width: 18px; height: 18px; margin-right: 8px;"
          data-icon="ion-checkmark-circle-outline"
          data-inline="false"
        />
        Отправить на модерацию
      </v-btn>
      <div
        v-else
        style="width: 230px; padding: 6px 20px 0 0;"
      >
        <v-switch
          v-model="program.active"
          :label="program.active ? 'Снять с публикации' : 'Опубликовать'"
          inset
          hide-details
          class="custom-switch"
          :loading="loadingActive"
          :disabled="loadingActive || program.moderation_status === 'TEMPLATE' || program.moderation_status === 'REJECT'"
          @change="setActive()"
        />
      </div>

      <v-btn
        color="secondary"
        small
        @click="toRoute(`/company/${program.id}/info`)"
      >
        <span
          class="iconify"
          style="margin-right: 8px;"
          data-icon="feather:settings"
          data-inline="false"
        />
        Настроить компанию
      </v-btn>
    </div>
  </div>
</template>

<script>
  import DateRangeSelect from '@/components/dialogs/DateRangeSelect'

  export default {
    components: {
      DateRangeSelect,
    },
    props: {
    },
    data () {
      return {
        loading: false,
        loadingActive: false,
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
      periods () {
        return this.$store.getters['reference/date_selection/periods']
      },
      period () {
        return this.$store.getters['reference/date_selection/period']
      },
      periodId: {
        get () {
          return this.$store.getters['reference/date_selection/periodId']
        },
        set (v) {
          this.$store.commit('reference/date_selection/periodId', v)
        },
      },
    },
    methods: {
      toRoute (path) {
        if (this.$route.path !== path) this.$router.push(path)
      },
      async setModeration () {
        try {
          this.loading = true
          await this.$store.dispatch('company/program/setModeration', this.program)
        } finally {
          this.loading = false
        }
      },
      async setActive () {
        try {
          this.loadingActive = true
          await this.$store.dispatch('company/program/setActive', this.program)
        } finally {
          this.loadingActive = false
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
.loyalty-toolbar {
  position: relative;
  display: flex;
  align-items: center;
  margin: 0;
  @media (max-width: 1120px) {
    display: block;
  }

  .loyalty-toolbar-name {
    display: inline-grid;
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    letter-spacing: -0.2px;
    color: #2A2A34;
    max-width: 35%;
    //overflow: hidden;
    //text-overflow: ellipsis;

    div {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  .loyalty-toolbar-period {
    display: inline-grid;
    margin-left: 12px;
    font-style: normal;
    font-weight: 600;
    font-size: 17px;
    line-height: 22px;
    letter-spacing: 0.4px;
    color: #4776E6;
    cursor: pointer;

    .loyalty-toolbar-period-chevron {
      font-size: 24px;
      position: relative;
      top: 4px;
    }
  }

  .loyalty-toolbar-name-hint {
    position: absolute;
    top: 36px;
    width: 200px;
    font-size: 13px;
    font-weight: normal;

    .loyalty-toolbar-name-hint-red {
      color: red;
    }

    .loyalty-toolbar-name-hint-green {
      color: green;
    }
  }

  .loyalty-toolbar-text-btn {
    position: relative;
    top: -2px;
    margin-right: 2px;
    font-style: normal;
    font-weight: 600;
    font-size: 13px;
    line-height: 17px;
    color: #4776E6;
    cursor: pointer;

    .loyalty-toolbar-text-btn-icon {
      position: relative;
      top: 4px;
      font-size: 18px;
    }
  }
}
</style>

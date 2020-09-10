<template>
  <div class="loyalty-toolbar">
    <div class="loyalty-toolbar-name">
      {{ program.name }}
    </div>
    <v-menu
      class="certificate-toolbar-select"
      offset-y
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          text
          color="primary"
          dark
          v-bind="attrs"
          class="archive-status-btn"
          v-on="on"
        >
          {{ archiveStatus.text }}
        </v-btn>
      </template>
      <v-list
        class="my-class"
      >
        <v-list-item
          v-for="(item, index) in archiveStatuses"
          :key="index"
          @click="archiveStatusHandler(item)"
        >
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <div class="app__spacer" />
    <div
      style="display: inline-grid;"
    >
      <div
        class="loyalty-toolbar-text-btn"
        @click=""
      >
        <span
          class="iconify loyalty-toolbar-text-btn-icon"
          style="margin-right: 2px;"
          data-icon="ion:document-outline"
          data-inline="false"
        />
        Экспорт в XLS
      </div>
    </div>
    <div
      style="display: inline-grid; margin-left: 16px;"
    >
      <v-btn
        color="secondary"
        @click="onMasterCreateCert"
      >
        <v-icon left>
          $iconify_feather-settings
        </v-icon> Настроить сертификаты
      </v-btn>
    </div>
    <div
      style="display: inline-grid; margin-left: 16px;"
    >
      <v-btn
        color="primary"
      >
        <v-icon left>
          $iconify_plus-circle-outlined
        </v-icon> Создать новый сертификат
      </v-btn>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
    },
    data () {
      return {
        archiveStatusId: null,
        archiveStatuses: [
          { id: 'work', text: 'в работе' },
          { id: 'archive', text: 'в архиве' },
        ],
      }
    },
    computed: {
      program () {
        return this.$store.getters['company/program/program']
      },
      archiveStatus: {
        get () {
          return this.$store.getters['account/certificate/filter/archiveStatus']
        },
        set (v) {
          this.$store.commit('account/certificate/filter/archiveStatus', v)
        },
      },
    },
    watch: {
      archiveStatusId (v) {
        if (v) {
          const archiveStatus = this.archiveStatuses.find(item => item.id === v)
          if (archiveStatus) {
            this.archiveStatus = archiveStatus
          }
        }
      },
    },
    created () {
      console.log('st...')
      console.log(this.archiveStatus)
    },
    methods: {
      onMasterCreateCert () {
        this.$router.push({ name: 'ProgramCertificateMaster' })
      },
      archiveStatusHandler (item) {
        this.$store.commit('account/certificate/filter/archiveStatus', item)
      },
    },
  }
</script>

<style lang="scss" scoped>
.loyalty-toolbar {
  display: flex;
  align-items: center;
  margin: 0;

  .loyalty-toolbar-name {
    font-style: normal;
    font-weight: bold;
    font-size: 22px;
    line-height: 26px;
    letter-spacing: -0.2px;
    color: #2A2A34;
    max-width: 35%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .loyalty-toolbar-period {
    display: flex;
    align-items: flex-end;
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

.archive-status-btn {
  text-transform: lowercase;
  &::before {
    background-color: transparent!important;
  }
}

</style>

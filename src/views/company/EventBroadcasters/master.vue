<template lang="">
  <div style="height: 100%;">
    <v-row
      v-if="currentStep<3"
      no-gutters
    >
      <v-col>
        <base-stepper
          v-model="currentStep"
          :items="stepList"
          @close="$router.back()"
        >
          <v-row
            justify="center"
            class="cert-master-row"
            no-gutters
          >
            <v-col :cols="8">
              <v-tabs-items
                v-model="currentStep"
                v-if="broadcaster"
              >
                <v-tab-item
                  :value="0"
                >
                  <step-main
                    ref="PageMain"
                    v-model="broadcaster"
                    @continue="currentStep=1"
                  />
                </v-tab-item>
                <v-tab-item
                  :value="1"
                >
                  <step-filter
                    ref="PageRules"
                    v-model="broadcaster"
                    @continue="currentStep=2"
                  />
                </v-tab-item>
                <v-tab-item
                  :value="2"
                >
                  <step-handlers
                    ref="PageHandlers"
                    v-model="broadcaster"
                    @continue="currentStep=1"
                  />
                </v-tab-item>
              </v-tabs-items>
            </v-col>
          </v-row>
        </base-stepper>
      </v-col>
    </v-row>
    <base-empty-block-page
      v-else
      title="Активность создана!"
      action-icon=""
      action-text="Ок"
      action
      @action="$router.push({name: 'EventBroadcastersList'} )"
    >
      <template v-slot:image>
        <v-img
          src="@/assets/png/Empty-Company.png"
          max-width="215px"
          max-height="175px"
        />
      </template>
      <template v-slot:description>
        <span>Создавайте и настраивайте программы и сертификаты,<br> отслеживайте показатели продаж и многое другое.</span>
      </template>
    </base-empty-block-page>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    components: {
      StepMain: () => import('./EventBroadcasterFormTabs/tabMain.vue'),
      StepFilter: () => import('./EventBroadcasterFormTabs/tabFilter.vue'),
      StepHandlers: () => import('./EventBroadcasterFormTabs/tabHandlers.vue'),
    },
    constants: {
      DEFAULT_BROADCASTER: {
        name: '',
        description: '',
        start_at: null,
        finish_at: null,
        emit_mode: 'MANUAL',
        listen_event: null,
        parent_broadcaster_id: null,
        client_filter: {
          type: 'SQL',
          clause: '',
        },
        period: null,
        with_trashed: false,
        handlers: [],
      },
      stepList: [
        { title: 'Общие настройки' },
        { title: 'Отбор клиентов' },
        { title: 'Обработчики' },
      ],
    },
    data () {
      return {
        createCertificateLoading: false,
        currentStep: 0,
        broadcaster: null,
      }
    },
    computed: {
      ...mapGetters('', ['programId']),
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.broadcaster = Object.assign({}, this.DEFAULT_BROADCASTER)
        this.currentStep = 0
      },
      onClickNew () {
        this.init()
      },

    },
  }
</script>
<style lang="scss" scoped>
@import '@/styles/variables.scss';

.cert-master-row {
  margin-top: $page-content-padding-size;
}
</style>

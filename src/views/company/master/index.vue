<template>
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
        <!-- <v-row>{{program}}</v-row> -->
          <v-row
            justify="center"
            class="cert-master-row"
            no-gutters
          >
          
            <v-tabs-items
              v-model="currentStep"
            >
              <v-tab-item
                :value="0"
                eager
              >
                <step-main
                  v-model="program"
                  @continue="currentStep=1"
                />
              </v-tab-item>
              <v-tab-item
                :value="1"
                eager
              >
                <step-rules
                  v-model="program"
                  @continue="currentStep=2"
                />
              </v-tab-item>
              <v-tab-item
                :value="2"
                eager
              >
                <step-nominals
                  v-model="program"
                  @continue="currentStep=3"
                />
              </v-tab-item>
            </v-tabs-items>
          </v-row>
        </base-stepper>
      </v-col>
    </v-row>
    <base-empty-block-page
      v-else
      title="Компания создана!"
    >
      <template v-slot:image>
        <v-img
          src="@/assets/png/auth-side-panel-img2.png"
          width="193.96px"
          height="174px"
        />
      </template>
      <template v-slot:description>
        <span>Теперь вы можете создавать и настраивать программы<br>лояльности, выпускать сертификаты и многое другое.<br> Вам доступен весь функционал Plus.
        </span>
      </template>
      <template v-slot:actions>
        <v-row>
          <v-col>
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn
                  color="secondary"
                  @click="$router.push({name: 'ProgramCertificateMaster'})"
                  width="326"
                
                >
                  <v-icon left>
                    $iconify_ant-design-gift-outlined
                  </v-icon>
                  Выпустить подарочный сертификат
                </v-btn>
              </v-col>
            </v-row>
            <v-row justify="center">
              <v-col cols="auto">
                <v-btn
                  color="primary"
                  @click="$router.push({name: 'ProgramBonusSetting'})"
                  width="326"
                >
                  <v-icon left>
                    $iconify_ion-wallet-outline
                  </v-icon>
                  Создать программу лояльности
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </template>
    </base-empty-block-page>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  import StepMain from './Step1Main'
  import StepRules from './Step2Shops'
  import StepNominals from './Step3Contacts'

  const DEFAULT_PROGRAM = {
    name: '',
    logo: null,
    fileLogo: null,
    color: null,
    allow_issue: false,
    bgcolor1: '#014171',
    shops: [],
    socials: {
      vk: '',
      youtube: '',
      facebook: '',
      instagram: '',
    },
  }

  export default {
    components: { StepMain, StepNominals, StepRules },
    constants: {
      stepList: [
        { title: 'Общая информация' },
        { title: 'Точки продаж' },
        { title: 'Контактные данные' },
      ],
    },
    data () {
      return {
        currentStep: 0,
        program: DEFAULT_PROGRAM,
      }
    },
    computed: {
      // ...mapGetters('company/program', ['program']),
    },
    created () {
      this.init()
    },
    methods: {
      init () {
        this.program = Object.copy(DEFAULT_PROGRAM)
        console.log('this.program', this.program)
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
  // margin-top: $page-content-padding-size;
}
</style>

<template>
  <dialog-form-block-row
    title="Иконка валюты"
    desc="Выберите иконку для вашей валюты. Она будет отображаться у клиентов в приложении. "
  >
    <v-btn
      v-if="iconSetIdInternal"
      class="bonus-icon-btn"
      icon
    >
      <v-img
        class="bonus-icon"
        :src="selectedIconSet.icon_active"
        @click="onSelectIcon"
      />
    </v-btn>

    <v-btn
      v-else
      color="secondary"
      @click="onSelectIcon"
    >
      <v-icon left>
        $iconify_feather-star
      </v-icon> <span>Выбрать иконку</span>
    </v-btn>

    <BaseDrawerDialog
      v-model="dialog"
      title="Иконка валюты"
      stateless
    >
      <dialog-form-block-row
        v-if="selectedIconSet"
        title="Пример отображения"
        desc="В таком виде клиенты будут видеть иконку в приложении."
      >
        <v-row>
          <v-col
            cols="auto"
            class="bonus-icon-preview"
          >
            <v-img
              class="bonus-icon"
              :src="selectedIconSet.icon_active"
            />
          </v-col>
          <v-col
            v-for="n in [1, 2, 3]"
            :key="n"
            cols="auto"
            class="bonus-icon-preview"
          >
            <v-img
              class="bonus-icon"
              :src="selectedIconSet.icon_inactive"
            />
          </v-col>
          <v-col
            v-if="withGoal"
            cols="auto"
            class="bonus-icon-preview-goal"
          >
            <v-img
              class="bonus-icon"
              :src="selectedIconSet.icon_goal"
            />
          </v-col>
        </v-row>
      </dialog-form-block-row>
      <v-row>
        <v-col
          v-for="iconSet in bonusUnitIcons"
          :key="iconSet.id"
          cols="2"
        >
          <v-btn
            class="bonus-icon-btn"
            :class="{
              'bonus-icon-btn': true,
              'bonus-icon-btn-active': iconSetIdInternal === iconSet.id,
            }"
            icon
          >
            <v-img
              class="bonus-icon"
              :src="iconSet.icon_active"
              @click="onClickIcon(iconSet)"
            />
          </v-btn>
        </v-col>
      </v-row>
      <v-row style="margin-top:28px">
        <v-col>
          <v-btn
            color="primary"
            :disabled="!iconSetIdInternal"
            @click="onSubmitIcon"
          >
            <v-icon left>
              $iconify_check-circle
            </v-icon> Выбрать иконку
          </v-btn>
        </v-col>
      </v-row>
    </BaseDrawerDialog>
  </dialog-form-block-row>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'SelectIconRow',
    components: {
      DialogFormBlockRow: () => import('./base/DialogFormBlockRow'),
    },
    model: {
      prop: 'value',
      event: 'change',
    },

    props: {
      value: {
        type: Number,
        default: null,
      },
      withGoal: {
        type: Boolean,
        default: false,
      },
    },
    data () {
      return {
        dialog: false,
        iconSetIdInternal: null,
      }
    },
    computed: {
      ...mapGetters({
        bonusUnitIcons: 'company/bonus_units/bonusUnitIcons',
      }),

      selectedIconSet () {
        return this.$_.findWhere(this.bonusUnitIcons, {
          id: this.iconSetIdInternal,
        })
      },
    },
    watch: {},

    created () {
      this.init()
    },

    methods: {
      ...mapActions({
        getBonusUnitIcons: 'company/bonus_units/getBonusUnitIcons',
      }),
      onSelectIcon () {
        if (!this.iconSetIdInternal) {
          this.iconSetIdInternal = this.bonusUnitIcons.length
            ? this.bonusUnitIcons[0].id
            : null
        }
        this.dialog = true
      },
      onClickIcon (iconSet) {
        this.iconSetIdInternal = iconSet.id
      },
      onSubmitIcon () {
        this.$emit('change', this.iconSetIdInternal)
        this.dialog = false
      },
      async init () {
        this.iconSetIdInternal = this.value
        try {
          // this.deleteAction = true
          await this.getBonusUnitIcons()
        } catch (error) {
          console.error(error)
        } finally {
        // this.deleteAction = false
        }
      },
    },
  }
</script>
<style  lang="scss" scoped>
.bonus-icon-preview, .bonus-icon-preview-goal {
  width: 44px;
  height: 44px;
  border: 1.5px solid #f2f2f7;
  border-radius: 50%;
  .bonus-icon {
    width: 20px;
    height: 20px;
  }
}
.bonus-icon-preview-goal{
background: linear-gradient(90deg, #4776E6 0%, #8E54E9 100%);
}

.bonus-icon {
  width: 35px;
  height: 35px;
}
.bonus-icon-btn {
  width: 67px;
  height: 67x;
  padding: 32px 32px 32px 32px;
  border: 1px solid #f2f2f7;

  &.bonus-icon-btn-active {
    border: #4776e6 3px solid;
  }
}
</style>

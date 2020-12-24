<template>
  <v-row
    class="field-row"
  >
    <v-col>
      <v-row>
        <v-col class="title-m-bold field-title">
          {{ field.field_name }}
        </v-col>
      </v-row>
      <template v-for="feildKey in ['old', 'new']">
        <v-row :key="feildKey+'title'">
          <v-col class="body-l-semibold">
            {{ feildKey === 'old'? 'Было' : 'Стало' }}
          </v-col>
        </v-row>
        <v-row :key="feildKey+'value'">
          <v-col v-if="isImg && field[feildKey]">
            <img
              :src="$config.app.fileStorage + field[feildKey]"
              style="max-width:100%"
            >
          </v-col>
          <v-col
            v-else
            class="neutral-700--text"
            style="word-break: break-word;"
          >
            {{ field[feildKey] || '-' }}
          </v-col>
        </v-row>
      </template>
    </v-col>
  </v-row>
</template>

<script>

  export default {
    name: 'ModerationFieldRow',
    props: {
      field: {
        type: Object,
        required: true,
      },
      entityType: {
        type: String,
        required: true,
      },
    },
    computed: {
      isImg () {
        switch (this.entityType) {
          case 'certificates':
            return ['logo_url', 'logo_thumb'].includes(this.field.name)
          case 'programs':
            return ['logo', 'logo_short'].includes(this.field.name)
          default:
            return false
        }
      },

    },
  }
</script>

<style lang="scss" scoped>
$row-space: 7px;

.field-row {
  margin-top: $row-space;
  margin-bottom: $row-space;
  // margin-top: 25px;
  .field-title {
    padding-top: 24px;
    padding-bottom: 24px;
  }
}

</style>

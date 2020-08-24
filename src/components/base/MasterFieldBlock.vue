<template>
  <v-container>
    <v-row>
      <v-col>
        <master-field-title :title="title" />
      </v-col>
    </v-row>
    <v-row v-if="horisontal">
      <v-col>
        <master-field-describe>
          <slot name="describe">{{ describe }}</slot>
        </master-field-describe>
      </v-col>
      <v-col>
        <slot name="input" />
      </v-col>
    </v-row>
    <v-row v-else>
      <v-col>
        <v-row>
          <v-col>
            <master-field-describe>
            <slot name="describe">{{ describe }}</slot>
          </master-field-describe>
          </v-col>
        </v-row>
        <v-row>
          <v-col> <slot name="input" /></v-col>
         
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MasterFieldTitle from "./MasterFieldTitle";
import MasterFieldDescribe from "./MasterFieldDescribe";

export default {
  name: "MasterFieldBlock",
  components: { MasterFieldTitle, MasterFieldDescribe },
  props: {
    horisontal: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    describe: {
      type: String,
      default: "",
    },
  },

  computed: {},
};
</script>

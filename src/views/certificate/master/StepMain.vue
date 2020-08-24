<template lang="">
  <v-container>
    <v-row
      align="center"
      justify="center"
    >
      StepMain
      <BaseMasterFieldBlock
        title="sd"
        describe="sdfsd"
        :horisontal="false"
      >
      <span slot="describe"> sdfdsfdsf<br/>fdgdf</span>
 
        <template slot="input">
          <div>
             <v-text-field
                  v-model="name"
                  :validate-on-blur="true"
                  placeholder="Название комании"
                  outlined
                  counter="20"                  
                  maxlength="20"                  
                />
          </div>
        </template>
      </BaseMasterFieldBlock>
      <v-btn
        color="success"
        @click="onNextClick"
      >
        next
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>

  export default {
    data () {
      return {
        name:''
      }
    },
    computed: {

    },
    created () {

    },
    methods: {
      onNextClick () {
        this.$emit('continue', true)
      },
    },
  }
</script>

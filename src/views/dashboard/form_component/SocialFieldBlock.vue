<template>
  <BaseMasterFieldBlock
    title="Социальные сети"
    :horisontal="true"
  >
    <span
      slot="description"
    >Введите адреса ваших профилей и групп в социальных сетях. Вводите только название профиля, которое стоит в самом конце адресной строки после символа “/”.</span>
    <template v-slot:input>
      <div class="socials-row">
        <v-row
          v-for="(field) in socialFields"
          :key="field"
        >
          <v-col>
            <social-input

              v-model="program.socials[field]"
              :type="field"
            />
          </v-col>
        </v-row>
      </div>
    </template>
  </BaseMasterFieldBlock>
</template>

<script>

  export default {
    components: {
      SocialInput: () => import('@/views/dashboard/form_component/SocialInput.vue'),
    },
    model: {
      prop: 'program',
      event: 'change',
    },
    props: {
      program: {
        type: Object,
        required: true,
      },
    },
    data () {
      return {

      }
    },
    computed: {

    },

    watch: {

    },

    constants: {
      socialFields: ['vk', 'youtube', 'facebook', 'instagram'],
    },

    created () {
     
    },

    methods: {     

    },
  }
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.socials-row{
  margin-top: -$container-padding-x;
}
</style>
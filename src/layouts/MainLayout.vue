
<template>
  <q-layout view="lHh lpR lFf">

    <q-drawer show-if-above v-model="left" side="left" behavior="desktop">
       drawer content
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>

export default {
  name: 'MainLayout',

  data () {
    return {
      leftDrawerOpen: false,
      left: true
    }
  }
}
</script>

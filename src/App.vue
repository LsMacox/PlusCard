<template>
  <div>
    <vue-progress-bar />
    <notifications group="api" />
    <notifications />
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
  }
</script>

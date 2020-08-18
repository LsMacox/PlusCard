<template>
  <div>
    <vue-progress-bar />
    <notifications group="api" />
    <router-view />
  </div>
</template>

<script>
  export default {
    name: 'App',
  }
</script>

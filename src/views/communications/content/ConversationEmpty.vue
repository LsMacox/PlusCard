<template>
  <div
    class="app--chat--empty"
    style="margin: auto"
  >
    <base-empty
      v-if="!loading"
      sub-text="Клиенты пока еще ничего не писали вам."
    />
    <v-progress-circular
      v-else
      :size="60"
      :width="5"
      color="neutral-400"
      indeterminate
    />
  </div>
</template>

<script>
  export default {
    props: {
      loading: Boolean,
    },
  }
</script>

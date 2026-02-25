<template>
  <div class="main-layout">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'MainLayout'
}
</script>

<style scoped>
.main-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
</style>

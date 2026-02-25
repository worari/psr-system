<template>
  <div class="auth-layout">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'AuthLayout'
}
</script>

<style scoped>
.auth-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>

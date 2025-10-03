<template>
  <div id="app">
    <router-view />
    <ToastNotification />
  </div>
</template>

<script>
import ToastNotification from './components/ToastNotification.vue'

export default {
  name: 'App',
  components: {
    ToastNotification
  }
}
</script>

<style lang="scss">
/* App-level stil: global main.scss zaten import edildi */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f9f9f9;
}
</style>

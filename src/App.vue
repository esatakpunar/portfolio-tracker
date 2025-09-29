<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
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

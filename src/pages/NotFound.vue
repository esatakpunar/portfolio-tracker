<template>
  <div class="container">
    <h1>404</h1>
    <p>Sayfa bulunamadı</p>
  </div>
  <router-link to="/">
    <button class="btn btn--primary">Ana Sayfa</button>
  </router-link>
</template>

<script>
export default {
  name: 'NotFound',
}
</script>

<style scoped>

</style>
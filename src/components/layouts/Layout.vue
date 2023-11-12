<template>
  <div class="layout">
    <Navbar ref="Navbar"/>
    <router-view class="main"/>
    <FooterPanel ref="FooterPanel"/>
  </div>
</template>

<script>
  import Navbar from '@/components/layouts/Navbar';
  import FooterPanel from '@/components/layouts/FooterPanel';

  export default {
    name: 'Layout',
    components: {
      Navbar,
      FooterPanel
    }
  }
</script>

<style lang="scss">
  .layout {
    background: linear-gradient(to left, #24243e, #302b63, #24243e);
    .main {
    margin: 0px auto;
   	height: 100vh;
    }
  }
</style>

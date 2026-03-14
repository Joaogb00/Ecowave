<template>
  <section class="hero-principal">
    <Header/>
    

  </section>

</template>

<script>
import Header from '../Header.vue';
export default{
  name:'Hero',
  components:{
    Header
  }
  
}
</script>

<style scoped>
.hero-principal{
  height:100vh ;
  background-color: green;
  
}

</style>
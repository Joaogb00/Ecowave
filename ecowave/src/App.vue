<template>
  <Hero/>
  <Footer/>
</template>

<script>
import Footer from './components/Footer.vue';
import Hero from './components/sections/Hero.vue';

export default{
  name:'App',
  components:{
    Footer,
    Hero
  }
}
</script>
<style>
*{
  padding: 0;
  margin: 0;
}
/* No seu style geral ou no App.vue */
body {
  font-family: 'Montserrat', sans-serif;
  margin: 0;
  padding: 0;
}

/* No seu componente Header.vue */


</style>
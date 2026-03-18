<template>
  <section class="hero-cadastrado">
<header-cad/>

    </section>
</template>
<script>

import HeaderCad from '@/components/Cadatrastrados/HeaderCad.vue';


export default{
  name:'Pag_cadastrado',
  components:{
    HeaderCad
  }
}
</script>
<style>
.hero-cadastrado{
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  
  overflow: hidden;
  
}


.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.493), rgba(0, 0, 0, 0.801));/*ideal */
  z-index: 2;
}
</style>
<template>
    <section class="hero-minhaconta">
        <HeaderCad/>
        <h1>Sua Conta</h1>
    </section>
</template>
<script>
import HeaderCad from '@/components/Cadatrastrados/HeaderCad.vue';

export default{
    name:'MinhaConta',
    components:{
        HeaderCad
    }
}
</script>
<style>
.hero-minhaconta{
    height: 100vh;
    font-family: 'Montserrat', sans-serif;
}
</style>
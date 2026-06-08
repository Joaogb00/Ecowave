<template>
  <div :class="['neco-container', isTourActive ? 'posicao-guia' : 'posicao-chatbot']">
    <div class="neco-avatar" @click="toggleChat">
      <img src="@/assets/img/neco.png" alt="Neco" />
    </div>

    <div v-if="!isTourActive && chatAberto" class="neco-chat-window">
      <div class="chat-header">Suporte EcoWave <span @click="chatAberto = false">X</span></div>
      <div class="chat-content">
        <p>{{ mensagem }}</p>
        <input v-model="input" @keyup.enter="processar" placeholder="Digite o número..." />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineExpose } from 'vue';

const isTourActive = ref(false);
const chatAberto = ref(false);
const input = ref('');
const mensagem = ref("Olá! Como posso ajudar?");

const toggleChat = () => { if (!isTourActive.value) chatAberto.value = !chatAberto.value; };
const iniciarModoGuia = () => { isTourActive.value = true; };
const finalizarModoGuia = () => { isTourActive.value = false; };

const processar = () => { /* lógica de perguntas do seu prompt anterior */ };

defineExpose({ iniciarModoGuia, finalizarModoGuia });
</script>

<style scoped>
.neco-container { position: fixed; z-index: 9999; transition: all 0.5s ease; }
.posicao-guia { top: 20%; left: 10%; } /* Lado esquerdo, levemente abaixo */
.posicao-chatbot { bottom: 20px; right: 20px; } /* Canto inferior direito */
.neco-avatar img { width: 80px; cursor: pointer; }
.neco-chat-window { width: 280px; background: white; padding: 15px; border-radius: 10px; box-shadow: 0 5px 20px rgba(0,0,0,0.3); }
</style>
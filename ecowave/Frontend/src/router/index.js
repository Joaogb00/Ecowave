import { createRouter, createWebHistory } from 'vue-router'
import Formulario from '@/views/Formulario.vue'
import Hero from '@/components/sections/Hero.vue'
import Pag_cadastrado from '@/views/Cadastrado/Pag_cadastrado.vue'
import MinhaConta from '../views/Cadastrado/MinhaConta.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
     {
       path: '/',
       name: 'inicio',
       component: Hero,
     },
     {
       path: '/formulario',
       name: 'form',
       component: Formulario,
     },
     {
       path: '/cadastrado',
       name: 'cadastrado',
       component: Pag_cadastrado,
     },
     {
       path: '/minhaconta',
       name: 'minhaconta',
       component: MinhaConta,
     },
    
  ],
})

export default router

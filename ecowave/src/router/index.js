import { createRouter, createWebHistory } from 'vue-router'
import Formulario from '@/views/Formulario.vue'
import Hero from '@/components/sections/Hero.vue'

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
    
  ],
})

export default router

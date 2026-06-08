import { createRouter, createWebHistory } from 'vue-router'
import Formulario from '@/views/Formulario.vue'
import Hero from '@/components/sections/Hero.vue'
import Pag_cadastrado from '@/views/Cadastrado/Pag_cadastrado.vue'
import MinhaConta from '../views/Cadastrado/MinhaConta.vue'
import Loja from '@/views/Cadastrado/Loja.vue'
import Adm from '@/views/Admnistrador/Adm.vue'
import Users from '@/views/Admnistrador/Users.vue'
import MinhaContaAdm from '@/views/Admnistrador/MinhaContaAdm.vue'
import LojaAdm from '@/views/Admnistrador/LojaAdm.vue'
import Reciclagem from '@/views/Cadastrado/Reciclagem.vue'
import PontosDeColeta from '@/views/Admnistrador/PontosDeColeta.vue'
import Pontos from '@/views/Cadastrado/Pontos.vue'
import Denuncias from '@/views/Cadastrado/Denuncias/Denuncias.vue'
import Notificacao from '@/components/Notifição/Notificacao.vue'
import MinhaContaProprietario from '@/views/Proprietario/MinhaContaProprietario.vue'

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
      path: '/notficacoes',
      name: 'notificacao',
      component: Notificacao,
    },
    {
      path: '/cadastrado',
      name: 'cadastrado',
      component: Pag_cadastrado,
      meta: { requiresAuth: true },
    },
    {
      path: '/minhaconta',
      name: 'minhaconta',
      component: MinhaConta,
      meta: { requiresAuth: true },
    },
    {
      path: '/Loja',
      name: 'loja',
      component: Loja,
      meta: { requiresAuth: true },
    },
    {
      path: '/administrador',
      name: 'adm',
      component: Adm,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/users',
      name: 'users',
      component: Users,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/minhacontaadm',
      name: 'minhacontaadm',
      component: MinhaContaAdm,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/lojaadm',
      name: 'lojaadm',
      component: LojaAdm,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/reciclagem',
      name: 'reciclagem',
      component: Reciclagem,
      meta: { requiresAuth: true },
    },
    {
      path: '/pontodecoleta',
      name: 'pontodecoleta',
      component: PontosDeColeta,
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    
    {
      path: '/pontos',
      name: 'ponto',
      component: Pontos,
      meta: { requiresAuth: true },
    },
    {
      path: '/denuncia',
      name: 'denuncia',
      component: Denuncias,
      meta: { requiresAuth: true },
    },
    {
      path: '/cadastrarmateriais',
      name: 'cadasstromat',
      component: () => import('../views/Admnistrador/MateriaisAdm.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/denunciaadm',
      name: 'denunciaadm',
      component: () => import('../views/Admnistrador/Suporte.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: '/proprietario',
      name: 'proprietario',
      component: () => import('../views/Proprietario/Proprietario.vue'),
      meta: { requiresAuth: true, requiresProprietario: true },
    },
    {
      path: '/pontos-proprietario',
      name: 'pontosproprietario',
      component: () => import('../views/Proprietario/PontosProprietario.vue'),
      meta: { requiresAuth: true, requiresProprietario: true },
    },
    {
      path: '/minhacontaprop',
      name: 'contaproprietario',
      component: () => import('../views/Proprietario/MinhaContaProprietario.vue'),
      meta: { requiresAuth: true, requiresProprietario: true },
    },
    {
      path: '/registros',
      name: 'registroreciclagem',
      // CORREÇÃO: Caminho limpo para o arquivo .vue sem a extensão fantasma /index.js
      component: () => import('../views/Proprietario/RegistrosDeReciclagem.vue'),
      meta: { requiresAuth: true, requiresProprietario: true },
    },
  ],
})

// Guard global de segurança do EcoWave
router.beforeEach((to, from, next) => {
  if (typeof window === 'undefined') return next()

  const isLogged = sessionStorage.getItem('isLogged') === 'true'
  const papel = sessionStorage.getItem('ecoWave_role') || 'USER'

  // 1. Bloqueio por falta de autenticação geral
  if (to.meta.requiresAuth && !isLogged) {
    return next('/formulario?mode=login')
  }

  // 2. Proteção das rotas exclusivas do Administrador
  if (to.meta.requiresAdmin && papel !== 'ADMIN') {
    if (papel === 'PROPRIETARIO') {
      return next('/proprietario')
    }
    return next('/cadastrado')
  }

  // 3. Proteção das rotas exclusivas do Proprietário (Permite o Admin entrar se ele quiser inspecionar)
  if (to.meta.requiresProprietario && papel !== 'PROPRIETARIO') {
    if (papel === 'ADMIN') {
      return next()
    }
    return next('/cadastrado')
  }

  return next()
})

export default router
// src/stores/usuario.ts
import { defineStore } from 'pinia';

export const useUsuarioStore = defineStore('usuario', {
  state: () => ({
    id: null as string | null,
    nome: '' as string,
    email: '' as string,
    saldoCoins: 0,
  }),
  actions: {
    setUsuario(payload: { id: string; nome: string; email: string; saldoCoins: number }) {
      this.id = payload.id;
      this.nome = payload.nome;
      this.email = payload.email;
      this.saldoCoins = payload.saldoCoins;
    },
    setSaldoCoins(novoSaldo: number) {
      this.saldoCoins = novoSaldo;
    },
    incrementarCoins(qtd: number) {
      this.saldoCoins += qtd;
    },
  },
});
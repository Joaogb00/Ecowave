import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

interface ItemResgate {
    id: string;
    qtd: number;
}

interface PostReq {
    usuarioId: string;
    itens: ItemResgate[];
    endereco: any; // Recebe o objeto do front
}

class PostResgateService {
    async execute({ usuarioId, itens, endereco }: PostReq) {
        // 1. Busca o usuário
        const user = await prismaClient.usuario.findUnique({
            where: { id: usuarioId }
        });

        if (!user) throw new AppError("Usuário não encontrado", 404);

        // 2. Valida itens e calcula custo total
        let totalCusto = 0;
        const itensValidados = [];

        for (const item of itens) {
            const recompensa = await prismaClient.recompensa.findUnique({
                where: { id: item.id }
            });

            if (!recompensa) throw new AppError(`Recompensa ${item.id} não encontrada`, 404);
            if (recompensa.estoque < item.qtd) throw new AppError(`Estoque insuficiente para ${recompensa.nome}`, 409);

            totalCusto += (recompensa.pontosNecessarios * item.qtd);
            itensValidados.push({ ...recompensa, qtd: item.qtd });
        }

        if (user.totalPontos < totalCusto) {
            throw new AppError("Saldo insuficiente", 422);
        }

        // 3. Processa a Transação (Garante que tudo ocorra ou nada ocorra)
        return await prismaClient.$transaction(async (tx) => {
            // Atualiza saldo do usuário
            const novoUser = await tx.usuario.update({
                where: { id: usuarioId },
                data: { totalPontos: user.totalPontos - totalCusto }
            });

            const registrosCriados = [];

            for (const item of itensValidados) {
                // Diminui estoque
                await tx.recompensa.update({
                    where: { id: item.id },
                    data: { estoque: item.estoque - item.qtd }
                });

                // Cria registro de resgate
                const registro = await tx.usuarioRecompensa.create({
                    data: {
                        endereco: JSON.stringify(endereco), // Salva o endereço como string JSON
                        usuarioId: novoUser.id,
                        recompensaId: item.id
                    }
                });
                registrosCriados.push(registro);
            }

            return {
                message: "Compra realizada com sucesso",
                novoSaldo: novoUser.totalPontos,
                resgate: registrosCriados[0] // Retorna o primeiro registro para o histórico
            };
        });
    }
}

export { PostResgateService }
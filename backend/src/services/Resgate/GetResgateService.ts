import { AppError } from "../../middlewares/AppError";
import prismaClient from "../../prisma";

class GetResgateService{

    async execute(){

        const registros = await prismaClient.usuarioRecompensa.findMany({
            include:{
                usuario:{
                    select:{
                        nome: true,
                        email: true
                    }
                },
                recompensa:{
                    select:{
                        nome: true,
                        descricao: true,
                        empresaParceira:true
                    }
                }
            }
        });

        if (registros.length <= 0) {
            throw new AppError("Não existem registros", 404)
        }

        return {
            message: "Registros encontrados",
            registros: registros
        }

    }

}

export { GetResgateService }
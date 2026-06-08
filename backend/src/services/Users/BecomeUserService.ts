import prismaClient from "../../prisma";
import { AppError } from "../../middlewares/AppError";

interface IdUser{
    id: string
}

class BecomeUserService {
    
    async execute({ id }: IdUser){

        const User = await prismaClient.usuario.findFirst({
            where:{ id }
        });

        if(!User){
            throw new AppError("Usuario não encontrado", 404)
        }


        if ((await User).papel == "USUARIO") {
            throw new AppError("Esse usuario ja é um usuario comum", 409)
        }

        const NovoUser = await prismaClient.usuario.update({
            where: { id },
            data:{ 
                papel: "USUARIO" 
            },
            select:{
                id: true,
                nome: true,
                email: true,
                papel: true
            }
        })

        const pontosDesativados = await prismaClient.pontoDeColeta.updateMany({
            where:{ criadoPorId: id },
            data:{
                ativo: false
            },
        })

        return{
            message: "O usuario deixou de ser um propietario",
            usuario: NovoUser,
            pontosDesativados: pontosDesativados
        }

    }

}

export { BecomeUserService }
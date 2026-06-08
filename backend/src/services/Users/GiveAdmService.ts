import prismaClient from "../../prisma";
import { AppError } from "../../middlewares/AppError";

interface IdUser{
    id: string
}

class GiveAdmService {
    
    async execute({ id }: IdUser){

        const User = await prismaClient.usuario.findFirst({
            where:{ id }
        });

        if(!User){
            throw new AppError("Usuario não encontrado", 404)
        }

        if ((await User).papel == "ADMIN") {
            throw new AppError("Esse usuario ja é um Adimn", 409)
        }

        const NovoAdmin = await prismaClient.usuario.update({
            where: { id },
            data:{ 
                papel: "ADMIN" 
            }
        })

        return{
            message: "Usuario promovido com sucesso",
            usuario: NovoAdmin
        }

    }

}

export { GiveAdmService }
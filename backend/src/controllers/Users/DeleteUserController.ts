import { Request, Response } from "express";
import { DeleteUserService } from "../../services/Users/DeleteUserService";

class DeleteUserController{

    async handle(req: Request, res: Response){

        const { id } = req.params;

        const deleteUserService = new DeleteUserService();

        const DelUser = await deleteUserService.execute({
            id
        });

        return res.json(DelUser);

    }

}

export { DeleteUserController }
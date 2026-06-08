import { Request, Response } from "express";
import { DeleteReciclagemService } from "../../services/Reciclagem/DeleteReciclagemService";

class DeleteReciclagemController {

    async handle(req: Request, res: Response) {

        const { id } = req.params;

        const deleteReciclagemService = new DeleteReciclagemService();

        const usuarioDeletado = await deleteReciclagemService.execute({ id });

        return res.json(usuarioDeletado)

    }

}

export { DeleteReciclagemController }
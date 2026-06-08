import { Router } from 'express';

import { isAuthenticated } from './middlewares/isAuthenticated';
import { isAdmin } from './middlewares/isAdmin';
import { isOwner } from './middlewares/isOwner';

import { PostUserController } from './controllers/Users/PostUserController';
import { GetUserController } from './controllers/Users/GetUserController';
import { DeleteUserController } from './controllers/Users/DeleteUserController';
import { PutUserController } from './controllers/Users/PutUserController';
import { GetUniqueUserController } from './controllers/Users/GetUniqueUserController';
import { LoginUserController } from './controllers/Users/LoginUserController';
import { GiveAdmController } from './controllers/Users/GiveAdmController';
import { BecomeOwnerController } from './controllers/Users/BecomeOwnerController';
import { BecomeUserController } from './controllers/Users/BecomeUserController';
import { SolicitacaoUpgradeController } from './controllers/Users/SolicitacaoUpgradeController';

import { PostMaterialController } from './controllers/Material/PostMaterialController';
import { GetMaterialController } from './controllers/Material/GetMaterialController';
import { PutMaterialController } from './controllers/Material/PutMaterialController';
import { DeleteMaterialController } from './controllers/Material/DeleteMaterialController';

import { PostPontoColetaController } from './controllers/PontoColeta/PostPontoColetaController';
import { GetPontoColetaController } from './controllers/PontoColeta/GetPontoColetaController';
import { PutPontoColetaController } from './controllers/PontoColeta/PutPontoColetaController';
import { DeletePontoColetaController } from './controllers/PontoColeta/DeletePontoColetaController';
import { GetPontoByOwnerController } from './controllers/PontoColeta/GetPontoByOwnerController';

import { PostRecompensaController } from './controllers/Recompensa/PostRecompensaController';
import { DeleteRecompensaController } from './controllers/Recompensa/DeleteRecompensaController';
import { PutRecompensaController } from './controllers/Recompensa/PutRecompensaController';
import { GetRecompensaController } from './controllers/Recompensa/GetRecompensaController';

import { PostReciclagemController } from './controllers/Reciclagem/PostReciclagemController';
import { GetReciclagemController } from './controllers/Reciclagem/GetReciclagemController';
import { DeleteReciclagemController } from './controllers/Reciclagem/DeleteReciclagemController';
import { PutReciclagemController } from './controllers/Reciclagem/PutReciclagemController';
import { GetReciclagemByUserController } from './controllers/Reciclagem/GetReciclagemByUserController';

import { PostDenunciaController } from './controllers/Denuncia/PostDenunciaController';
import { DeleteDenunciaController } from './controllers/Denuncia/DeleteDenunciaController';
import { GetDenunciaController } from './controllers/Denuncia/GetDenunciaController';
import { PutDenunciaController } from './controllers/Denuncia/PutDenunciaController';

import { PostResgateController } from './controllers/Resgate/PostResgatecontroller';
import { GetResgateController } from './controllers/Resgate/GetResgateController';
import { GetResgateByUserController } from './controllers/Resgate/GetResgateByUserController';

import { DashboardProprietarioController } from './controllers/Propietario/DashboardPropietarioController';
import { DashboardAdminController } from './controllers/Admin/DashboardAdminController';
import { UploadRecompensaImagemController } from './controllers/Recompensa/UploadRecompensaImagemController';
import { upload } from './middlewares/upload';
import { EsqueciSenhaController } from '../src/controllers/Users/EsqueciSenhaController';
import { VerificarCodigoController } from '../src/controllers/Users/VerificarCodigoController';
import { ReenviarCodigoController } from '../src/controllers/Users/ReenviarCodigoController';
import { ResetPasswordController } from '../src/controllers/Users/ResetPasswordController';
import { ValidarCaptchaController } from '../src/controllers/Users/ValidarCaptchaController';
const router = Router();

// Controllers “singleton” para rotas de solicitação de upgrade
const solicitacaoUpgradeController = new SolicitacaoUpgradeController();

// USERS
router.post('/NovoUsuario', new PostUserController().handle);
router.post('/Login', new LoginUserController().handle);
router.get('/Usuarios', isAuthenticated, isAdmin, new GetUserController().handle);
router.get('/Usuario/:id', isAuthenticated, new GetUniqueUserController().handle);
router.put(
  '/EditarUsuario/:id', 
  isAuthenticated, 
  upload.single('fotoPerfil'), // <--- ADICIONE ISSO AQUI
  new PutUserController().handle
);
// Mude de router.put para router.post
// router.post('/TornarPropietario', isAuthenticated, new BecomeOwnerController().handle);

router.post('/TornarPropietario', isAuthenticated, (req, res) => new BecomeOwnerController().handle(req, res));
router.put('/DarAdm/:id', isAuthenticated, isAdmin, new GiveAdmController().handle);
router.delete('/DeletarUsuario/:id', isAuthenticated, isAdmin, new DeleteUserController().handle);

// Fluxo de upgrade para PROPRIETARIO (cria solicitação PENDENTE)
router.put('/TornarPropietario', isAuthenticated, new BecomeOwnerController().handle);

// Rotas de SOLICITAÇÃO DE UPGRADE (Admin e Usuário)
router.get(
  '/SolicitacaoUpgrade/Pendentes',
  isAuthenticated,
  isAdmin,
  (req, res) => solicitacaoUpgradeController.listarPendentes(req, res)
);

router.get(
  '/SolicitacaoUpgrade/Usuario/:userId',
  isAuthenticated,
  (req, res) => solicitacaoUpgradeController.statusPorUsuario(req, res)
);

router.put(
  '/SolicitacaoUpgrade/:id/Aceitar',
  isAuthenticated,
  isAdmin,
  (req, res) => solicitacaoUpgradeController.aceitar(req, res)
);

router.put(
  '/SolicitacaoUpgrade/:id/Recusar',
  isAuthenticated,
  isAdmin,
  (req, res) => solicitacaoUpgradeController.recusar(req, res)
);

// MATERIAIS
router.post('/NovoMaterial', isAuthenticated, isAdmin, new PostMaterialController().handle);
router.get('/Materiais', new GetMaterialController().handle);
router.put('/EditarMaterial/:id', isAuthenticated, isAdmin, new PutMaterialController().handle);
router.delete('/DeletarMaterial/:id', isAuthenticated, isAdmin, new DeleteMaterialController().handle);

// PONTOS DE COLETA
router.post('/NovoPontoDeColeta', isAuthenticated, isOwner, new PostPontoColetaController().handle);
router.get('/PontosDeColeta', new GetPontoColetaController().handle);
router.get('/MeusPontos', isAuthenticated, isOwner, new GetPontoByOwnerController().handle);
router.put('/EditarPontoDeColeta/:id', isAuthenticated, isOwner, new PutPontoColetaController().handle);
router.delete('/ExcluirPontoDeColeta/:id', isAuthenticated, isOwner, new DeletePontoColetaController().handle);

// RECOMPENSAS
router.post('/NovaRecompensa', isAuthenticated, isAdmin, new PostRecompensaController().handle);
router.get('/Recompensas', new GetRecompensaController().handle);
router.put('/EditarRecompensa/:id', isAuthenticated, isAdmin, new PutRecompensaController().handle);
router.delete('/DeletarRecompensa/:id', isAuthenticated, isAdmin, new DeleteRecompensaController().handle);

// RECICLAGENS
router.post('/NovoRegistro', isAuthenticated, isOwner, new PostReciclagemController().handle);
router.get('/Registros', new GetReciclagemController().handle);
router.get('/MinhasReciclagens', isAuthenticated, new GetReciclagemByUserController().handle);
router.put('/EditarRegistro/:id', isAuthenticated, isOwner, new PutReciclagemController().handle);
router.delete('/DeletarRegistro/:id', isAuthenticated, isOwner, new DeleteReciclagemController().handle);

// DENUNCIAS
router.post('/NovaDenuncia', isAuthenticated, new PostDenunciaController().handle);
router.get('/Denuncias', isAuthenticated, isAdmin, new GetDenunciaController().handle);
router.put('/EditarDenuncia/:id', isAuthenticated, isAdmin, new PutDenunciaController().handle);
router.delete('/DeletarDenuncia/:id', isAuthenticated, isAdmin, new DeleteDenunciaController().handle);

// RESGATES
router.post('/NovoResgate', isAuthenticated, new PostResgateController().handle);
router.get('/Resgates', isAuthenticated, isAdmin, new GetResgateController().handle);
router.get('/MeusResgates', isAuthenticated, new GetResgateByUserController().handle);

// DASHBOARDS
router.get(
  '/dashboardProprietario',
  isAuthenticated,
  isOwner,
  new DashboardProprietarioController().handle
);
router.get(
  '/dashboardAdmin',
  isAuthenticated,
  isAdmin,
  new DashboardAdminController().handle
);
router.post('/ValidarCaptcha', new ValidarCaptchaController().handle);
router.post('/EsqueciSenha', new EsqueciSenhaController().handle);
router.post('/ReenviarCodigo', new ReenviarCodigoController().handle);
router.post('/VerificarCodigo', new VerificarCodigoController().handle);
router.post('/ResetPassword', new ResetPasswordController().handle);


router.post(
  '/UploadRecompensaImagem', 
  isAuthenticated, 
  isAdmin, 
  upload.single('imagem'), 
  new UploadRecompensaImagemController().handle
);
export default router;
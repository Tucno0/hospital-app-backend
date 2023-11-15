import { Router } from 'express';
import { check } from 'express-validator';
import { googleSignIn, login, renewToken } from '../controllers/auth.controllers.js';
import { validarCampos } from '../middlewares/validar-campos.js';
import { validarJWT } from '../middlewares/validar-jwt.js';

const router = Router();

//* POST /api/auth/login: Login de usuario
router.post(
  '/login',
  [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos,
  ],
  login,
);

//* POST /api/auth/google: Login de usuario con Google
router.post(
  '/google',
  [
    // middlewares
    check('token', 'El token de Google es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  googleSignIn,
);

router.get(
  '/renew',
  [
    // middlewares
    validarJWT,
  ],
  renewToken,
);

export default router;

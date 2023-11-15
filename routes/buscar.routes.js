import { Router } from 'express';
import { getBuscarPorColeccion, getTodo } from '../controllers/buscar.controllers.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { check } from 'express-validator';

const router = Router();

router.get(
  '/todo/:busqueda',
  [
    // middlewares
    validarJWT,
    check('busqueda', 'La búsqueda es obligatoria').not().isEmpty(),
  ],
  getTodo,
);

router.get(
  '/:coleccion/:termino',
  [
    // middlewares
    validarJWT,
    check('coleccion', 'La colección es obligatoria').not().isEmpty(),
    check('termino', 'El término de búsqueda es obligatorio').not().isEmpty(),
  ],
  getBuscarPorColeccion,
);

export default router;

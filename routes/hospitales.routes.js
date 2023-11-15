import { Router } from 'express';
import {
  deleteHospital,
  getHospitales,
  postHospital,
  putHospital,
} from '../controllers/hospitales.controllers.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { existeHospitalPorId } from '../helpers/db-validators.js';

//! Ruta: /api/hospitales

const router = Router();

router.get('/', validarJWT, getHospitales);

router.post(
  '/',
  [
    // middlewares
    validarJWT,
    check('nombre', 'El nombre del hospital es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  postHospital,
);

router.put(
  '/:id',
  [
    // middlewares
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeHospitalPorId),
    check('nombre', 'El nombre del hospital es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  putHospital,
);

router.delete(
  '/:id',
  [
    // middlewares
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeHospitalPorId),
    validarCampos,
  ],
  deleteHospital,
);

export default router;

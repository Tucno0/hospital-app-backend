import { Router } from 'express';
import {
  deleteMedico,
  getMedico,
  getMedicos,
  postMedico,
  putMedico,
} from '../controllers/medicos.controllers.js';
import { validarJWT } from '../middlewares/validar-jwt.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { existeHospitalPorId, existeMedicoPorId } from '../helpers/db-validators.js';

const router = Router();

//! Ruta: /api/medicos

router.get('/', validarJWT, getMedicos);

router.get(
  '/:id',
  [
    // middlewares
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    validarCampos,
  ],
  getMedico,
);

router.post(
  '/',
  [
    // middlewares
    validarJWT,
    check('nombre', 'El nombre del médico es obligatorio').not().isEmpty(),
    check('hospital', 'El id del hospital es obligatorio').not().isEmpty(),
    check('hospital').custom(existeHospitalPorId),
    validarCampos,
  ],
  postMedico,
);

router.put(
  '/:id',
  [
    // middlewares
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeMedicoPorId),
    check('nombre', 'El nombre del médico es obligatorio').not().isEmpty(),
    check('hospital', 'El id del hospital es obligatorio').not().isEmpty(),
    check('hospital', 'El id del hospital no es válido').isMongoId(),
    check('hospital').custom(existeHospitalPorId),
    validarCampos,
  ],
  putMedico,
);

router.delete(
  '/:id',
  [
    // middlewares
    validarJWT,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeMedicoPorId),
    validarCampos,
  ],
  deleteMedico,
);

export default router;

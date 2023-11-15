import { Router } from 'express';
import { validarArchivoSubir, validarCampos, validarJWT } from '../middlewares/index.js';
import { fileUpload, getImage, getImageByUserId, updateImage } from '../controllers/uploads.controllers.js';
import { check } from 'express-validator';

const router = Router();

//! Ruta: /api/uploads

//* Subir archivos
router.post('/', [validarJWT, validarArchivoSubir], fileUpload);

//* Actualizar imagen de usuario o medico o hospital
router.put(
  '/:coleccion/:id',
  [
    // middlewares
    validarJWT,
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    validarCampos,
  ],
  updateImage,
);

//* Obtener imagen por coleccion y nombre de imagen
router.get('/:coleccion/:foto', getImage);

//* Obtener imagen por coleccion y usuario id
// router.get('/user/:coleccion/:id', getImageByUserId);

export default router;

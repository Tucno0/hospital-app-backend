import { Router } from 'express';
import { deleteRol, getRoles, postRol } from '../controllers/roles.controller.js';
import { check } from 'express-validator';
import { validarCampos } from '../middlewares/validar-campos.js';
import { existeRolPorId } from '../helpers/db-validators.js';

const router = Router();

//* GET /api/roles: Obtener todos los roles de la base de datos
router.get('/', getRoles);

//* POST /api/roles: Crear un nuevo rol en la base de datos
router.post(
  '/',
  [
    // middlewares
    check('rol', 'El rol es obligatorio').not().isEmpty(),
    validarCampos,
  ],
  postRol,
);

//* DELETE /api/roles: Borrar un rol de la base de datos
router.delete(
  '/:id',
  [
    // middlewares
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeRolPorId),
    validarCampos,
  ],
  deleteRol,
);

export default router;

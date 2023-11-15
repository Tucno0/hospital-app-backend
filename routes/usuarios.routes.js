import { Router } from 'express';
import {
  getUsuarios,
  postUsuario,
  putUsuario,
  patchUsuario,
  deleteUsuario,
} from '../controllers/usuarios.controllers.js';
import { check } from 'express-validator';
import { emailExiste, esRolValido, existeUsuarioPorId } from '../helpers/db-validators.js';
import { validarCampos, validarJWT } from '../middlewares/index.js';
import { esAdminRole, esAdminRoleOMismoUsuario, tieneRole } from '../middlewares/validar-roles.js';

const router = Router();

//* GET /api/usuarios: Obtener todos los usuarios de la base de datos
router.get('/', [validarJWT], getUsuarios); // ? getUsuarios es el controlador
// forma completa: (req, res) => getUsuarios(req, res)

//* POST /api/usuarios: Crear un nuevo usuario en la base de datos
router.post(
  '/',
  [
    // middlewares
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password debe tener al menos 6 caracteres').isLength({
      min: 6,
    }),
    check('email').custom(emailExiste),
    validarCampos,
  ],
  postUsuario,
); // ? postUsuarios es el controlador

//* PUT /api/usuarios: Actualizar un usuario en la base de datos
router.put(
  '/:id',
  [
    // validar que el usuario que actualiza el usuario tenga un token válido
    validarJWT,
    esAdminRoleOMismoUsuario,
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('rol', 'El rol es obligatorio').not().isEmpty(),
    check('rol').custom(esRolValido),
    validarCampos,
  ],
  putUsuario,
);

//* DELETE /api/usuarios: Borrar un usuario de la base de datos
router.delete(
  '/:id',
  [
    // validar que el usuario que actualiza el usuario tenga un token válido
    validarJWT,
    esAdminRole,
    // tieneRole('ADMIN_ROLE', 'VENTAS_ROLE', 'OTRO_ROLE'),
    check('id', 'No es un ID válido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos,
  ],
  deleteUsuario,
);

//* PATCH /api/usuarios: Actualizar un dato de un usuario en la base de datos
router.patch('/', patchUsuario);

export default router;

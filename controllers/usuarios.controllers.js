import { request, response } from 'express';
import bcryptjs from 'bcryptjs';
import { Rol, Usuario } from '../models/index.js';
import { generarJWT } from '../helpers/generar-jwt.js';

export const getUsuarios = async (req = request, res = response) => {
  // Verificar si se encuentra el usuario en el request
  if (!req.usuario) {
    return res.status(500).json({
      msg: 'Se quiere verificar el rol sin validar el token primero',
    });
  }

  // Recibir los parametros de la url con query
  const { limite = 5, desde = 0 } = req.query;
  // para que devuelva solo los usuarios que tengan estado: true
  const query = { estado: true };
  // 'nombre email rol google' es la forma de filtrar los campos que se quieren mostrar
  // const usuarios = await Usuario.find({}, 'nombre email rol google');
  const [total, usuarios] = await Promise.all([
    Usuario.countDocuments(query),
    Usuario.find(query).skip(Number(desde)).limit(Number(limite)),
  ]);

  res.json({
    total,
    usuarios,
    usuarioAutenticado: req.usuario,
  });
};

export const postUsuario = async (req = request, res = response) => {
  const { nombre, email, password, rol } = req.body;
  const usuario = new Usuario({ nombre, email, password });

  try {
    // Verificar si el rol es válido
    if (rol) {
      const existeRol = await Rol.findOne({ rol });

      if (!existeRol) {
        return res.status(400).json({
          msg: `El rol ${rol} no está registrado en la base de datos`,
        });
      }

      usuario.rol = rol;
    }

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en la base de datos
    await usuario.save();

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error al crear usuario',
    });
  }
};

export const putUsuario = async (req = request, res = response) => {
  const { id } = req.params;
  const { _id, password, email, google, ...resto } = req.body;

  try {
    const usuarioDB = await Usuario.findById(id);

    // Si el usuario envia una contraseña, entonces actualizar la contraseña
    if (password) {
      // Encriptar la contraseña
      const salt = bcryptjs.genSaltSync();
      resto.password = bcryptjs.hashSync(password, salt);
    }

    if (!usuarioDB.estado) {
      return res.status(400).json({
        msg: 'El usuario no existe',
      });
    }

    if (email && email !== usuarioDB.email) {
      const existeEmail = await Usuario.findOne({ email });
      if (existeEmail) {
        return res.status(400).json({
          msg: 'El correo ya está registrado',
        });
      }
    }

    if (!usuarioDB.google) {
      resto.email = email;
    } else if (usuarioDB.email !== email) {
      return res.status(400).json({
        msg: 'Los usuarios de google no pueden cambiar su correo',
      });
    }

    // Actualizar el usuario en la base de datos
    const usuarioActualizado = await Usuario.findByIdAndUpdate(id, resto, {
      new: true,
    });

    res.json({
      msg: 'Usuario actualizado correctamente',
      usuario: usuarioActualizado,
      usuarioAutenticado: req.usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error al actualizar usuario',
    });
  }
};

export const deleteUsuario = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
      msg: 'Usuario eliminado correctamente',
      usuario,
      usuarioAutenticado: req.usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error al eliminar usuario',
    });
  }
};

export const patchUsuario = async (req = request, res = response) => {
  res.json({
    ok: true,
    msg: 'patchUsuarios',
  });
};

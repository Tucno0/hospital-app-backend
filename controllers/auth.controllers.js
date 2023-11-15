import { request, response } from 'express';
import bcryptjs from 'bcryptjs';

import { Usuario } from '../models/index.js';
import { generarJWT } from '../helpers/generar-jwt.js';
import { googleVerify } from '../helpers/google-verify.js';
import { getMenuFrontEnd } from '../helpers/menu-frontend.js';

export const login = async (req = request, res = response) => {
  const { email, password } = req.body;
  try {
    const usuario = await Usuario.findOne({ email });

    // Verificar si el email existe en la base de datos
    if (!usuario) {
      return res.status(400).json({
        msg: 'El usuario no existe con ese email',
      });
    }

    // Verificar si el usuario está activo en la base de datos
    if (!usuario.estado) {
      return res.status(400).json({
        msg: 'El usuario no existe',
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);

    // Si la contraseña no es válida
    if (!validPassword) {
      return res.status(400).json({
        msg: 'La contraseña es incorrecta',
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
      menu: getMenuFrontEnd(usuario.rol),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error al hacer login',
    });
  }
};

export const googleSignIn = async (req = request, res = response) => {
  const { token } = req.body;

  try {
    // Se verifica el token de Google
    const googleUser = await googleVerify(token);

    // Se obtienen los datos del usuario de Google
    const { name, email, picture } = googleUser;

    // Se verifica si el usuario existe en la base de datos
    const usuarioDB = await Usuario.findOne({ email });

    let usuario;

    // Si el usuario no existe en la base de datos se crea
    if (!usuarioDB) {
      const data = {
        nombre: name,
        email,
        password: '@@@',
        img: picture,
        google: true,
      };

      usuario = new Usuario(data);
    } else {
      // Si el usuario existe en la base de datos se actualiza
      usuario = usuarioDB;
      usuario.google = true;
    }

    // Se guarda el usuario en la base de datos
    await usuario.save();

    // Si el usuario en la base de datos está inactivo (estado: false)
    if (!usuario.estado) {
      res.status(401).json({
        msg: 'Hable con el administrador, usuario bloqueado',
      });
    }

    // Generar el JWT
    const JWTtoken = await generarJWT(usuario._id);

    res.json({
      usuario,
      token: JWTtoken,
      menu: getMenuFrontEnd(usuario.rol),
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: 'Token de Google no válido',
      error,
    });
  }
};

export const renewToken = async (req = request, res = response) => {
  try {
    // recuperar el usuario del request
    const { usuario } = req;

    // Generar el JWT
    const token = await generarJWT(usuario._id);
    res.json({
      usuario,
      token,
      menu: getMenuFrontEnd(usuario.rol),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error al renovar el token',
      error,
    });
  }
};

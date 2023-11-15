import { request, response } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

export const validarJWT = async (req = request, res = response, next) => {
  // Leer el token de la petición que se envía por el header authorization
  const tokenReq = req.headers.authorization;

  // Verificar si el token existe en la petición
  if (!tokenReq) {
    return res.status(401).json({
      msg: 'No hay token en la petición',
    });
  }

  try {
    // Extraer el token
    const token = tokenReq.split(' ')[1];

    // Verificar el token y extraer el uid
    const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

    // leer el usuario que corresponde al uid
    const usuario = await Usuario.findById(uid);

    // Verificar si el usuario existe en la base de datos
    if (!usuario) {
      return res.status(401).json({
        msg: 'Token no válido - usuario no existe en la base de datos',
      });
    }

    // Verificar si el usuario tiene estado: true
    if (!usuario.estado) {
      return res.status(401).json({
        msg: 'Token no válido - usuario con estado: false',
      });
    }

    // Agregar el usuario al request
    req.usuario = usuario;

    // next() para que se ejecute el siguiente middleware
    next();
  } catch (error) {
    return res.status(401).json({
      msg: 'Token no válido',
    });
  }
};

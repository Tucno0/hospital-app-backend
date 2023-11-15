import { request, response } from 'express';
import { Rol } from '../models/index.js';

export const getRoles = async (req = request, res = response) => {
  try {
    const [total, roles] = await Promise.all([
      Rol.countDocuments(), // Cuenta los documentos de la colección
      Rol.find(), // Busca todos los documentos de la colección
    ]);

    res.json({
      total,
      roles,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error al obtener roles',
    });
  }
};

export const postRol = async (req = request, res = response) => {
  const { rol } = req.body;

  try {
    const existeRol = await Rol.findOne({ rol });

    if (existeRol) {
      return res.status(400).json({
        msg: 'El rol ya está registrado',
      });
    }

    const rolDB = new Rol({ rol });

    await rolDB.save();

    res.json({
      msg: 'Rol creado correctamente',
      rol: rolDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error al crear rol',
    });
  }
};

export const deleteRol = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    // Eliminar rol de la base de datos (físicamente)
    const rol = await Rol.findByIdAndDelete(id);

    res.json({
      msg: 'deleteRol',
      rol,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error al eliminar rol',
    });
  }
};

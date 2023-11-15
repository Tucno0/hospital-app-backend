import { request, response } from 'express';
import { Hospital, Usuario } from '../models/index.js';

export const getHospitales = async (req = request, res = response) => {
  try {
    // Verificar si se encuentra el usuario en el request
    if (!req.usuario) {
      return res.status(500).json({
        msg: 'Se quiere verificar el rol sin validar el token primero',
      });
    }

    const { limite = 5, desde = 0 } = req.query;

    const [total, hospitales] = await Promise.all([
      Hospital.countDocuments(),
      Hospital.find().skip(Number(desde)).limit(Number(limite)).populate('usuario', 'nombre img'),
    ]);

    res.json({
      total,
      hospitales,
      usuarioAutenticado: req.usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener hospitales',
    });
  }
};

export const postHospital = async (req = request, res = response) => {
  try {
    const { nombre } = req.body;
    const { _id } = req.usuario;

    const hospital = new Hospital({ nombre, usuario: _id });

    await hospital.save();

    res.json({
      msg: 'Hospital creado correctamente',
      hospital,
      usuarioCreador: req.usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al crear un hospital',
    });
  }
};

export const putHospital = async (req = request, res = response) => {
  try {
    const { nombre } = req.body;
    const { id } = req.params;

    const hospitalActualizado = await Hospital.findByIdAndUpdate(
      id,
      { nombre, usuario: req.usuario._id },
      { new: true },
    );

    res.json({
      msg: 'Hospital actualizado correctamente',
      hospital: hospitalActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error al actualizar un hospital',
      error,
    });
  }
};

export const deleteHospital = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    // const hospitalEliminado = await Hospital.findByIdAndUpdate(id, { estado: false }, { new: true });
    const hospitalEliminado = await Hospital.findByIdAndDelete(id);

    res.json({
      msg: 'Hospital eliminado correctamente',
      hospital: hospitalEliminado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al borrar un hospital',
    });
  }
};

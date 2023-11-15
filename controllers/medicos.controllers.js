import { request, response } from 'express';
import { Medico } from '../models/index.js';

export const getMedicos = async (req = request, res = response) => {
  try {
    const { limite = 5, desde = 0 } = req.query;

    const [total, medicos] = await Promise.all([
      Medico.countDocuments(),
      Medico.find()
        .skip(Number(desde))
        .limit(Number(limite))
        .populate('usuario', 'nombre img')
        .populate('hospital', 'nombre img'),
    ]);

    res.json({
      total,
      medicos,
      usuarioAutenticado: req.usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener medicos',
    });
  }
};

export const getMedico = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const medico = await Medico.findById(id)
      .populate('usuario', 'nombre img')
      .populate('hospital', 'nombre img');

    if (!medico) {
      return res.status(404).json({
        msg: 'No existe un medico con ese id',
      });
    }

    res.json(medico);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener un medico',
    });
  }
};

export const postMedico = async (req = request, res = response) => {
  try {
    const { nombre, hospital } = req.body;
    const { _id } = req.usuario;

    const medico = new Medico({ nombre, usuario: _id, hospital });

    await medico.save();

    res.json({
      msg: 'Medico creado correctamente',
      medico,
      usuarioCreador: req.usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al crear un medico',
    });
  }
};

export const putMedico = async (req = request, res = response) => {
  try {
    const { nombre, hospital } = req.body;
    const { id } = req.params;

    const medicoActualizado = await Medico.findByIdAndUpdate(
      id,
      { nombre, hospital, usuario: req.usuario._id },
      { new: true },
    );

    res.json({
      msg: 'Medico actualizado correctamente',
      medico: medicoActualizado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al actualizar un medico',
    });
  }
};

export const deleteMedico = async (req = request, res = response) => {
  try {
    const { id } = req.params;

    const medicoBorrado = await Medico.findByIdAndDelete(id);

    res.json({
      msg: 'Medico borrado correctamente',
      medico: medicoBorrado,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al borrar un medico',
    });
  }
};

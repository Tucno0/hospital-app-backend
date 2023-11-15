import { request, response } from 'express';
import { Types } from 'mongoose';
import { Hospital, Medico, Usuario } from '../models/index.js';

const { ObjectId } = Types;
const coleccionesPermitidas = ['usuarios', 'hospitales', 'medicos', 'roles'];

export const getTodo = async (req = request, res = response) => {
  try {
    const { busqueda } = req.params;
    const regex = new RegExp(busqueda, 'i'); // i: insensible a mayúsculas y minúsculas
    const query = { nombre: regex };

    const [totalUsuarios, usuarios, totalHospitales, hospitales, totalMedicos, medicos] = await Promise.all([
      Usuario.countDocuments(query),
      Usuario.find(query),
      Hospital.countDocuments(query),
      Hospital.find(query).populate('usuario', 'nombre img'),
      Medico.countDocuments(query),
      Medico.find(query).populate('usuario', 'nombre img').populate('hospital', 'nombre img'),
    ]);

    // const usuarios = await Usuario.find(quuery);

    res.json({
      totalResultados: totalUsuarios + totalHospitales + totalMedicos,
      totalUsuarios,
      usuarios,
      totalHospitales,
      hospitales,
      totalMedicos,
      medicos,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al obtener todo',
    });
  }
};

export const getBuscarPorColeccion = async (req = request, res = response) => {
  try {
    const { coleccion, termino } = req.params;

    if (!coleccionesPermitidas.includes(coleccion)) {
      return res.status(400).json({
        msg: `La colección ${coleccion} no está permitida, las colecciones permitidas son: ${coleccionesPermitidas}`,
      });
    }

    switch (coleccion) {
      case 'usuarios':
        await buscarUsuarios(termino, res);
        break;
      case 'hospitales':
        await buscarHospitales(termino, res);
        break;
      case 'medicos':
        await buscarMedicos(termino, res);
        break;
      default:
        return res.status(500).json({
          msg: 'Se me olvidó hacer esta búsqueda',
        });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Error al buscar',
    });
  }
};

const buscarUsuarios = async (termino = '', res = response) => {
  // Validamos si el término es un ID de Mongo válido. Devuelve true si es válido
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const usuario = await Usuario.findById(termino);
    return res.json({
      results: usuario ? [usuario] : [],
    });
  }

  const regex = new RegExp(termino, 'i');

  const [total, usuarios] = await Promise.all([
    // Contamos cuántos usuarios hay en la base de datos que cumplan con el término
    Usuario.countDocuments({
      $or: [{ nombre: regex }, { email: regex }],
      $and: [{ estado: true }],
    }),
    // Devuelve un arreglo con los resultados de la búsqueda
    Usuario.find({
      $or: [{ nombre: regex }, { email: regex }],
      $and: [{ estado: true }],
    }),
  ]);

  res.json({
    total,
    results: usuarios,
  });
};

const buscarHospitales = async (termino = '', res = response) => {
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const hospital = await Hospital.findById(termino);
    return res.json({
      results: hospital ? [hospital] : [],
    });
  }

  const regex = new RegExp(termino, 'i');

  const [total, hospitales] = await Promise.all([
    Hospital.countDocuments({ nombre: regex }),
    Hospital.find({ nombre: regex }).populate('usuario', 'nombre img'),
  ]);

  res.json({
    total,
    results: hospitales,
  });
};

const buscarMedicos = async (termino = '', res = response) => {
  const esMongoID = ObjectId.isValid(termino);

  if (esMongoID) {
    const medico = await Medico.findById(termino);
    return res.json({
      results: medico ? [medico] : [],
    });
  }

  const regex = new RegExp(termino, 'i');

  const [total, medicos] = await Promise.all([
    Medico.countDocuments({ nombre: regex }),
    Medico.find({ nombre: regex }).populate('usuario', 'nombre img').populate('hospital', 'nombre img'),
  ]);

  res.json({
    total,
    results: medicos,
  });
};

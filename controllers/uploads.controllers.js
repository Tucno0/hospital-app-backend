import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { request, response } from 'express';
import { subirArchivo } from '../helpers/subir-archivo.js';
import { Hospital, Medico, Usuario } from '../models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathImgDefault = path.join(__dirname, '../uploads/no-img.jpg');

export const fileUpload = async (req = request, res = response) => {
  try {
    // guada el archivo en la carpeta uploads/imgs
    const nombreArchivo = await subirArchivo(req.files, undefined, 'imgs');

    res.json({
      msg: 'Archivo subido correctamente',
      archivo: nombreArchivo,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: error,
    });
  }
};

export const updateImage = async (req = request, res = response) => {
  try {
    const { coleccion, id } = req.params;

    //* Validar coleccion
    const coleccionesPermitidas = ['usuarios', 'medicos', 'hospitales'];
    // si no se encuentra la coleccion en el array de colecciones permitidas
    if (!coleccionesPermitidas.includes(coleccion)) {
      return res.status(400).json({
        ok: false,
        msg: `La coleccion ${coleccion} no es permitida, solo se permite ${coleccionesPermitidas}`,
      });
    }

    //* Validar que exista el id en la coleccion
    let modelo;

    switch (coleccion) {
      case 'usuarios':
        modelo = await Usuario.findById(id);

        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un usuario con el id ${id}`,
          });
        }

        break;

      case 'medicos':
        modelo = await Medico.findById(id);

        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un medico con el id ${id}`,
          });
        }

        break;

      case 'hospitales':
        modelo = await Hospital.findById(id);

        if (!modelo) {
          return res.status(400).json({
            msg: `No existe un hospital con el id ${id}`,
          });
        }

        break;

      default:
        return res.status(500).json({
          msg: 'Se me olvido validar esto',
        });
    }

    //* Limpiar imagenes previas
    if (modelo.img) {
      // Se obtiene la ruta de la imagen
      const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img);

      // Si existe la imagen en la ruta
      if (fs.existsSync(pathImagen)) {
        // Se elimina la imagen
        fs.unlinkSync(pathImagen);
      }
    }

    //* Actualizar la imagen
    const nombreArchivo = await subirArchivo(req.files, undefined, coleccion);
    // Se actualiza el modelo con el nombre de la imagen
    modelo.img = nombreArchivo;

    //* Guardar en la base de datos
    await modelo.save();

    res.json({
      msg: 'Imagen actualizada correctamente',
      coleccion,
      id,
      modelo,
      usuarioQueActualizo: req.usuario,
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: error,
    });
  }
};

export const getImage = async (req = request, res = response) => {
  try {
    const { coleccion, foto } = req.params;

    const pathImg = path.join(__dirname, `../uploads/${coleccion}/${foto}`);

    if (fs.existsSync(pathImg)) {
      return res.sendFile(pathImg);
    }

    return res.sendFile(pathImgDefault);
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: 'Error al obtener imagen',
      error,
    });
  }
};

export const getImageByUserId = async (req = request, res = response) => {
  try {
    res.json({
      ok: true,
      msg: 'getImageByUserId',
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      msg: 'Error al obtener imagen por usuario id',
      error,
    });
  }
};

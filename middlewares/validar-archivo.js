import { request, response } from 'express';

export const validarArchivoSubir = (req = request, res = response, next) => {
  // si no hay archivos en la petición
  if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
    return res.status(400).json({
      msg: 'No hay archivos que subir - validarArchivoSubir',
    });
  }

  next();
};

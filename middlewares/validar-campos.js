import { validationResult } from 'express-validator';

// Middleware para validar los campos de los request que llegan al servidor
export const validarCampos = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  next();
};

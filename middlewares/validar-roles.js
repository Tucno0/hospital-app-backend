import { request, response } from 'express';

export const esAdminRole = (req = request, res = response, next) => {
  try {
    if (!req.usuario) {
      return res.status(500).json({
        msg: 'Se quiere verificar el rol sin validar el token primero',
      });
    }

    const { rol, nombre } = req.usuario;

    if (rol !== 'ADMIN_ROLE') {
      return res.status(401).json({
        msg: `${nombre} no tiene privilegios de administrador`,
      });
    }

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error al verificar el rol - hable con el administrador',
    });
  }
};

export const esAdminRoleOMismoUsuario = async (req = request, res = response, next) => {
  try {
    const { id } = req.params;
    const { _id, rol } = req.usuario;

    if (!req.usuario) {
      return res.status(500).json({
        msg: 'Se quiere verificar el rol sin validar el token primero',
      });
    }

    if (rol === 'ADMIN_ROLE' || _id.toString() === id) {
      next();
    } else {
      return res.status(401).json({
        msg: 'No tiene privilegios para realizar esta acción',
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error al verificar el rol - hable con el administrador',
    });
  }
};

export const tieneRole = (...roles) => {
  return (req = request, res = response, next) => {
    // si el usuario no se ha validado antes
    if (!req.usuario) {
      return res.status(500).json({
        msg: 'Se quiere verificar el rol sin validar el token primero',
      });
    }

    // si el rol del usuario no está en el array de roles que se quieren validar
    // includes() devuelve true si el elemento está en el array
    if (!roles.includes(req.usuario.rol)) {
      return res.status(401).json({
        msg: `El servicio requiere uno de estos roles ${roles}`,
      });
    }

    next();
  };
};

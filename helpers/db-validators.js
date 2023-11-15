import { Hospital, Medico, Rol, Usuario } from '../models/index.js';

export const emailExiste = async (email = '') => {
  // Verificar si el correo existe en la base de datos
  const existeEmail = await Usuario.findOne({ email });

  // Si existeEmail es true, entonces el correo ya está registrado
  if (existeEmail) {
    throw new Error(`El correo ${email} ya está registrado`);
  }
};

export const existeUsuarioPorId = async (id) => {
  // Verificar si el usuario existe en la base de datos
  const existeUsuario = await Usuario.findById(id);
  // Si no existeUsuario es true, entonces el usuario no existe
  if (!existeUsuario) {
    throw new Error(`El id ${id} no existe en la colección de usuarios`);
  }
};

export const esRolValido = async (rol = '') => {
  const existeRol = await Rol.findOne({ rol });

  // Si existeRol es true, entonces el rol ya está registrado
  if (!existeRol) {
    throw new Error(`El rol ${rol} no está registrado en la base de datos`);
  }
};

export const existeRolPorId = async (id) => {
  // Verificar si el rol existe en la base de datos
  const existeRol = await Rol.findById(id);
  // Si no existeRol es true, entonces el rol no existe
  if (!existeRol) {
    throw new Error(`El id ${id} no existe en la colección de roles`);
  }
};

export const existeHospitalPorId = async (id) => {
  // Verificar si el hospital existe en la base de datos
  const existeHospital = await Hospital.findById(id);
  // Si no existeHospital es true, entonces el hospital no existe
  if (!existeHospital) {
    throw new Error(`El id ${id} no existe en la colección de hospitales`);
  }
};

export const existeMedicoPorId = async (id) => {
  // Verificar si el medico existe en la base de datos
  const existeMedico = await Medico.findById(id);
  // Si no existeMedico es true, entonces el medico no existe
  if (!existeMedico) {
    throw new Error(`El id ${id} no existe en la colección de medicos`);
  }
};

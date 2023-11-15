import { Schema, model } from 'mongoose';

const RolSchema = new Schema(
  {
    rol: {
      type: String,
      required: [true, 'El rol es obligatorio'],
    },
  },
  { collection: 'roles' },
);

export default model('Rol', RolSchema);

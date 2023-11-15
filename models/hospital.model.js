import { Schema, model } from 'mongoose';

const HospitalSchema = Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
    },
    img: {
      type: String,
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
  },
  { collection: 'hospitales' },
); // Para que la colección se llame hospitales y no hospital en la base de datos (MongoDB Atlas)

HospitalSchema.methods.toJSON = function () {
  const { __v, ...hospital } = this.toObject();
  return hospital;
};

export default model('Hospital', HospitalSchema);

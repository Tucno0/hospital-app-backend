import { Schema, model } from 'mongoose';

const MedicoSchema = Schema({
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
  hospital: {
    type: Schema.Types.ObjectId,
    ref: 'Hospital',
    required: [true, 'El id del hospital es obligatorio'],
  },
});

MedicoSchema.methods.toJSON = function () {
  const { __v, ...medico } = this.toObject();
  return medico;
};

export default model('Medico', MedicoSchema);

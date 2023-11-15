import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import fileUpload from 'express-fileupload';

import { dbConnection } from './database/config.js';

// Importar rutas
import usuariosRoutes from './routes/usuarios.routes.js';
import authRoutes from './routes/auth.routes.js';
import rolesRoutes from './routes/roles.routes.js';
import hospitalesRoutes from './routes/hospitales.routes.js';
import medicosRoutes from './routes/medicos.routes.js';
import buscarRoutes from './routes/buscar.routes.js';
import uploadsRoutes from './routes/uploads.routes.js';

//* Configurar dotenv para poder usar las variables de entorno
dotenv.config();

//* Puerto de la app
const port = process.env.PORT || 3000;

//* crear el servidor de express
const app = express();

//* Middlewares
// Configuracion de CORS
app.use(cors());
// Lectura y parseo del body
app.use(express.json());
// Directorio publico
app.use(express.static('public'));
// fileUpload - Carga de archivos
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
    createParentPath: true,
  }),
);

//* Base de datos
dbConnection();

//* Rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/hospitales', hospitalesRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/medicos', medicosRoutes);
app.use('/api/buscar', buscarRoutes);
app.use('/api/uploads', uploadsRoutes);

//* levantar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en puerto http://localhost:${port}`);
});

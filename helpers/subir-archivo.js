import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
  return new Promise((resolve, reject) => {
    // desestructuramos el archivo que viene en la peticion
    const { archivo } = files;
    // obtenemos la extension del archivo
    const nombreCortado = archivo.name.split('.');
    const extension = nombreCortado[nombreCortado.length - 1];

    // validar la extension
    if (!extensionesValidas.includes(extension)) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return reject(`La extension ${extension} no es permitida, solo se permiten ${extensionesValidas}`);
    }

    // generar el nombre del archivo
    const nombreTemp = crypto.randomUUID() + '.' + extension;

    // ruta donde se guardara el archivo
    // /uploads/carpeta/nombreTemp
    const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

    // mover el archivo a la carpeta uploads
    archivo.mv(uploadPath, (err) => {
      if (err) {
        console.log(err);
        return reject(err);
      }

      resolve(nombreTemp);
    });
  });
};

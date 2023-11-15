//! Implementación de la verificación del token de Google

// Se hace una importación de la librería de Google para verificar el token
import { OAuth2Client } from 'google-auth-library';

// Se obtienen las variables de entorno de Google
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_SECRET = process.env.GOOGLE_SECRET;

// Se crea una instancia del cliente de Google
const client = new OAuth2Client();

export const googleVerify = async (token = '') => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    // [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });

  const payload = ticket.getPayload();
  // const userid = payload.sub;
  // If request specified a G Suite domain:
  // const domain = payload['hd'];

  return payload;
};

// verify().catch(console.error);

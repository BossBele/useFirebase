// code shared with node server, use require and module exports
// The Firebase Admin SDK to access the Firebase Realtime Database
const admin = require('firebase-admin');
// firebase private key
const serviceAccount = JSON.parse(process.env.FB_SERVICE_ACCOUNT_KEY);
//
const adminConfig = {
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FB_DATABASE_URL,
};

if (!admin.apps.length) {
  // default app
  const defaultConfig = JSON.parse(process.env.FB_TOKEN || '{}');
  admin.initializeApp({ ...defaultConfig, ...adminConfig });
}

export default admin;

export * from './auth';
export * from './database/firestore';
export * from './messaging';

// code shared with node server, use require and module exports
// The Firebase Admin SDK to access the Firebase Realtime Database
const admin = require('firebase-admin');
// firebase private key
const serviceAccount = JSON.parse(process.env.FB_SERVICE_ACCOUNT_KEY);
//
const adminConfig: {[key: string]: any} = {
  credential: admin.credential.cert(serviceAccount),
};

if (process.env.FB_DATABASE_URL) {
  adminConfig.databaseURL = process.env.FB_DATABASE_URL;
}

if (!admin.apps.length) {
  admin.initializeApp(adminConfig);
}

export default admin;

export * from './auth';
export * from './database/firestore';
export * from './messaging';

const admin = require('firebase-admin');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = admin.initializeApp({
  credential: admin.cert(serviceAccount),
});

const db = getFirestore(app);
const auth = getAuth(app);

module.exports = { admin, db, auth, FieldValue };

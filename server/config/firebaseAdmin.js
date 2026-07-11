const admin = require('firebase-admin');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('../task-manager-635f4-firebase-adminsdk-fbsvc-e869044aef.json');

const app = admin.initializeApp({
  credential: admin.cert(serviceAccount),
});

const db = getFirestore(app);
const auth = getAuth(app);

module.exports = { admin, db, auth, FieldValue };
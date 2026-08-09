const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const serviceAccount = require('./firebaseServiceAccount.json');

const firebaseAdminApp = initializeApp({
  credential: cert(serviceAccount),
});

const adminAuth = getAuth(firebaseAdminApp);

module.exports = adminAuth;
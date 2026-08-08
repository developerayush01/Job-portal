const { getAuth, sendSignInLinkToEmail } = require('firebase/auth');
const firebaseApp = require('../config/firebaseConfig');
const admin = require('../config/firebaseAdmin');

const auth = getAuth(firebaseApp);

const sendVerificationLink = async (email) => {
  const actionCodeSettings = {
    url: `${process.env.FRONTEND_URL}/verify-email?email=${email}`,
    handleCodeInApp: true,
  };

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

const verifyIdToken = async (idToken) => {
  const decodedToken = await admin.auth().verifyIdToken(idToken);
  return decodedToken;
};

module.exports = { sendVerificationLink, verifyIdToken };
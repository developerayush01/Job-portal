const { getAuth, sendSignInLinkToEmail } = require('firebase/auth');
const firebaseApp = require('../config/firebaseConfig');

const auth = getAuth(firebaseApp);

const sendVerificationLink = async (email) => {
  const actionCodeSettings = {
  url: `${process.env.FRONTEND_URL}/verify-email?email=${email}`,
  handleCodeInApp: true,
};

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

module.exports = { sendVerificationLink };
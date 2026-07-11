const { auth } = require('../config/firebaseAdmin');

const authMiddleware = async (req, res, next) => {
  const sessionCookie = req.cookies.session;

  if (!sessionCookie) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    req.uid = decodedClaims.uid; 
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Session expired or invalid' });
  }
};

module.exports = authMiddleware;
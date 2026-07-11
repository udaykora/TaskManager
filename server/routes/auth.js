const express = require('express');
const router = express.Router();
const { db, auth, FieldValue } = require('../config/firebaseAdmin');

// SIGNUP — creates user in Firebase Auth, metadata in Firestore under uid
router.post('/signup', async (req, res) => {
  const { name, email, password, mobileNumber } = req.body;

  try {
    // 1. Create the user in Firebase Auth (email + password only)
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    // 2. Store everything else in Firestore, keyed by uid
    await db.collection('Users').doc(userRecord.uid).set({
      name,
      email,
      mobileNumber,
      createdAt: FieldValue.serverTimestamp(),
    });

    res.status(201).json({
      message: 'User created successfully',
      uid: userRecord.uid,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// LOGIN — verifies the ID token from client SDK, returns Firestore metadata
router.post('/login', async (req, res) => {
  const { idToken } = req.body;

  try {
   
    const decodedToken = await auth.verifyIdToken(idToken);
    const uid = decodedToken.uid;

    
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });
    res.cookie('session', sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    // 3. Fetch metadata from Firestore using the uid
    const userDoc = await db.collection('Users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User metadata not found' });
    }

    res.status(200).json({
      uid,
      email: decodedToken.email,
      ...userDoc.data(),
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});


// CHECK SESSION — used on app load to see if user is still logged in
router.get('/me', async (req, res) => {
  const sessionCookie = req.cookies.session;

  if (!sessionCookie) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const uid = decodedClaims.uid;

    const userDoc = await db.collection('Users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User metadata not found' });
    }

    res.status(200).json({ uid, ...userDoc.data() });
  } catch (error) {
    res.status(401).json({ message: 'Session expired or invalid' });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('session');
  res.status(200).json({ message: 'Logged out' });
});

module.exports = router;
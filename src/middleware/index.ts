import { NextFunction, Response } from 'express';
import { admin } from '../firebase/firebase';
import { RequestAuth } from '../types';

const verifyToken = async (
  req: RequestAuth,
  res: Response,
  next: NextFunction
) => {
  const idToken = req.cookies.access_token;
  if (!idToken) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).json({ error: 'Unauthorized' });
  }
};

export default verifyToken;

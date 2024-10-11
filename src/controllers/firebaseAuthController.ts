import { Request, Response, NextFunction } from 'express';
import { auth } from '../firebase/firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      error: 'Email and password are required'
    });
  }

  try {
    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user) {
      // Send verification email
      await sendEmailVerification(userCredential.user);

      return res.status(201).json({
        message: 'Verification email sent! User created successfully!'
      });
    } else {
      return res.status(400).json({ error: 'User not created successfully' });
    }
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({
      error: 'Email and password are required'
    });
  }

  try {
    // Sign in the user with email and password
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // If the user is successfully signed in
    if (userCredential.user) {
      const idToken = await userCredential.user.getIdToken();
      return res
        .status(200)
        .cookie('access_token', idToken, {
          httpOnly: true
        })
        .json({
          message: 'User logged in successfully!',
          user: {
            uid: userCredential.user.uid,
            email: userCredential.user.email
          }
        });
    } else {
      return res.status(400).json({ error: 'Login failed. User not found.' });
    }
  } catch (error) {
    const errorMessage =
      (error as Error).message || 'An error occurred during login';
    res.status(500).json({ error: errorMessage });
  }
};

export const logoutUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await signOut(auth);
    res.clearCookie('access_token');
    return res.status(200).json({ message: 'User logged out successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    return res.status(422).json({
      error: 'Email is required'
    });
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return res
      .status(200)
      .json({ message: 'Password reset email sent successfully!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

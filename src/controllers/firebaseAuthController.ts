import { Request, Response, NextFunction } from 'express';
import { auth } from '../firebase/firebase';

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { UserModel } from '../models/userModel';
import { DoctorModel } from '../models/doctorModel';

const userModel = new UserModel();
const doctorModel = new DoctorModel();

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const {
    email,
    password,
    first_name,
    last_name,
    user_type,
    specialty,
    location
  } = req.body;

  if (!email || !password || !first_name || !last_name || !user_type) {
    return res.status(422).json({
      error:
        'Email, password, first name, last name, and user type are required'
    });
  }

  try {
    // Create user with email and password in Firebase
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user) {
      const uid = userCredential.user.uid;

      // Insert the user into PostgreSQL using UserModel
      await userModel.create({
        uid,
        first_name,
        last_name,
        email,
        user_type
      });

      // Send verification email
      await sendEmailVerification(userCredential.user);

      if (user_type === 'doctor') {
        if (!specialty || !location) {
          return res.status(422).json({
            error: 'Specialty and location are required for doctors'
          });
        }

        await doctorModel.create({
          user_uid: uid,
          specialty,
          location
        });
      }

      return res.status(201).json({
        message:
          'Verification email sent! User created successfully in Firebase and PostgreSQL!'
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
    // Sign in the user with email and password in Firebase
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    if (userCredential.user) {
      const idToken = await userCredential.user.getIdToken();
      const uid = userCredential.user.uid;

      // Optionally, you can check the user in PostgreSQL
      const user = await userModel.findByUID(uid);

      if (!user) {
        return res.status(404).json({ error: 'User not found in database' });
      }

      return res
        .status(200)
        .cookie('access_token', idToken, {
          httpOnly: true
        })
        .json({
          message: 'User logged in successfully!',
          user: {
            uid: user.uid,
            email: user.email
          }
        });
    } else {
      return res.status(400).json({ error: 'Login failed. User not found.' });
    }
  } catch (error) {
    const errorMessage =
      (error as Error).message || 'An error occurred during login';
    return res.status(500).json({ error: errorMessage });
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

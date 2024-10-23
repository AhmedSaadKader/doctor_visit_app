import { Request, Response, NextFunction } from 'express';
import { auth, admin } from '../firebase/firebase';

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
  res: Response
): Promise<void> => {
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
    res.status(422).json({
      error:
        'Email, password, first name, last name, and user type are required'
    });
    return;
  }

  if (user_type === 'doctor') {
    if (!specialty || !location) {
      res.status(422).json({
        error: 'Specialty and location are required for doctors'
      });
      return;
    }
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
        await doctorModel.create({
          user_uid: uid,
          specialty,
          location
        });
      }

      res.status(201).json({
        message:
          'Verification email sent! User created successfully in Firebase and PostgreSQL!'
      });
      return;
    } else {
      res.status(400).json({ error: 'User not created successfully' });
      return;
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({
      error: 'Email and password are required'
    });
    return;
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
        res.status(404).json({ error: 'User not found in database' });
        return;
      }

      res
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
      return;
    } else {
      res.status(400).json({ error: 'Login failed. User not found.' });
      return;
    }
  } catch (error) {
    const errorMessage =
      (error as Error).message || 'An error occurred during login';
    res.status(500).json({ error: errorMessage });
  }
};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    await signOut(auth);
    res.clearCookie('access_token');
    res.status(200).json({ message: 'User logged out successfully!' });
    return;
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(422).json({
      error: 'Email is required'
    });
    return;
  }

  try {
    await sendPasswordResetEmail(auth, email);
    res
      .status(200)
      .json({ message: 'Password reset email sent successfully!' });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { uid } = req.params;
  const updates = req.body;

  if (!uid) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  try {
    // Update the user in PostgreSQL
    const updatedUser = await userModel.update(uid, updates);

    res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser
    });
    return;
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { uid } = req.params;

  if (!uid) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  try {
    // 1. Delete user from Firebase
    const firebaseUser = await admin.auth().getUser(uid);
    await admin.auth().deleteUser(uid);

    // 2. Delete user from PostgreSQL
    await userModel.deleteByUID(uid);

    // 3. If the user is a doctor, delete their doctor record
    const user = await userModel.findByUID(uid);
    if (user && user.user_type === 'doctor') {
      await doctorModel.deleteByUserUID(uid);
    }

    res.status(200).json({
      message: 'User deleted successfully from both Firebase and PostgreSQL'
    });
    return;
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({
      error: `An error occurred while deleting the user. ${(error as Error).message} `
    });
  }
};

export const fetchUserDetails = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { uid } = req.params;

  if (!uid) {
    res.status(400).json({ error: 'User ID is required' });
    return;
  }

  try {
    // Fetch user from PostgreSQL
    const user = await userModel.findByUID(uid);

    if (!user) {
      res.status(404).json({ error: `User with ID ${uid} not found` });
      return;
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const fetchAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all users from PostgreSQL
    const users = await userModel.findAllUsers(); // Assuming you have a method for this

    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

export const fetchAllDoctors = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Fetch all doctors from PostgreSQL
    const doctors = await userModel.findAllDoctors();

    res.status(200).json({ doctors });
  } catch (error) {
    console.error('Error fetching doctors:', error);
    res.status(500).json({ error: (error as Error).message });
  }
};

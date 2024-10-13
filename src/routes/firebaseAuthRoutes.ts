import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  resetPassword,
  deleteUser,
  updateUser,
  fetchAllUsers,
  fetchUserDetails
} from '../controllers/firebaseAuthController';

const router = Router();

router.get('/', fetchAllUsers);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/reset-password', resetPassword);
router.put('/:uid', updateUser);
router.delete('/:uid', deleteUser);
router.get('/:uid', fetchUserDetails);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - user_type
 *       properties:
 *         uid:
 *           type: string
 *           description: Firebase UID
 *         first_name:
 *           type: string
 *         last_name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         user_type:
 *           type: string
 *           enum: [doctor, patient]
 *           description: The role of the user
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *
 * /users:
 *   get:
 *     summary: Fetch all users
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Successfully fetched all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "doctor@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               user_type:
 *                 type: string
 *                 enum: [doctor, patient]
 *                 example: "doctor"
 *               specialty:
 *                 type: string
 *                 example: "Cardiology"
 *               location:
 *                 type: string
 *                 example: "New York"
 *     responses:
 *       201:
 *         description: User successfully registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       422:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 * /users/login:
 *   post:
 *     summary: Login a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "doctor@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged in successfully!"
 *                 user:
 *                   type: object
 *                   properties:
 *                     uid:
 *                       type: string
 *                       example: "qwe123abc"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "doctor@example.com"
 *       400:
 *         description: Login failed. User not found.
 *       422:
 *         description: Missing email or password
 *       500:
 *         description: Internal server error
 * /users/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [User]
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged out successfully!"
 *       500:
 *         description: Internal server error
 * /users/reset-password:
 *   post:
 *     summary: Send a password reset email to a user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "doctor@example.com"
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Password reset email sent successfully!"
 *       422:
 *         description: Email is required
 *       500:
 *         description: Internal server error
 * /users/{uid}:
 *   put:
 *     summary: Update user details
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: Unique identifier of the user
 *         schema:
 *           type: string
 *           example: "user-unique-id"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: "John"
 *               last_name:
 *                 type: string
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *               user_type:
 *                 type: string
 *                 enum: [doctor, patient]
 *                 example: "doctor"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: User ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User ID is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error message"
 *   delete:
 *     summary: Delete a user by UID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: Firebase UID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully from both Firebase and PostgreSQL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully from both Firebase and PostgreSQL"
 *       400:
 *         description: User ID is required
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *
 *   get:
 *     summary: Fetch user details by UID
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         description: Unique identifier of the user
 *         schema:
 *           type: string
 *           example: "user-unique-id"
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: User ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User ID is required"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Error message"
 */

export default router;

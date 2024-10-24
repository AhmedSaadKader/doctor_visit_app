import express from 'express';
import {
  fetchAllDoctors,
  getDoctorByUID,
  updateDoctor
} from '../controllers/doctorController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DoctorUserDetails:
 *       type: object
 *       properties:
 *         uid:
 *           type: string
 *           description: The UID of the user (Firebase UID)
 *         first_name:
 *           type: string
 *           description: The first name of the doctor
 *         last_name:
 *           type: string
 *           description: The last name of the doctor
 *         email:
 *           type: string
 *           description: The email of the doctor
 *         specialty:
 *           type: string
 *           description: The doctor's specialty
 *         location:
 *           type: string
 *           description: The location of the doctor
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: When the doctor record was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: When the doctor information was last updated
 */
/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Fetch all doctors
 *     tags: [Doctor]
 *     responses:
 *       200:
 *         description: Successfully fetched all doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 doctors:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DoctorUserDetails'
 *             example:
 *               doctors:
 *                 - uid: "abc123"
 *                   first_name: "John"
 *                   last_name: "Doe"
 *                   email: "johndoe@example.com"
 *                   specialty: "Cardiology"
 *                   location: "New York"
 *                   created_at: "2024-10-23T10:00:00Z"
 *                   updated_at: "2024-10-23T10:00:00Z"
 *                 - uid: "def456"
 *                   first_name: "Jane"
 *                   last_name: "Smith"
 *                   email: "janesmith@example.com"
 *                   specialty: "Pediatrics"
 *                   location: "Los Angeles"
 *                   created_at: "2024-10-23T10:05:00Z"
 *                   updated_at: "2024-10-23T10:05:00Z"
 *       500:
 *         description: Internal server error
 */
router.get('/', fetchAllDoctors);

/**
 * @swagger
 * /doctors/{uid}:
 *   get:
 *     summary: Get doctor details by user UID
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: The UID of the doctor (User UID)
 *     responses:
 *       200:
 *         description: Doctor details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorUserDetails'
 *             example:
 *               uid: "abc123"
 *               first_name: "John"
 *               last_name: "Doe"
 *               email: "johndoe@example.com"
 *               specialty: "Cardiology"
 *               location: "New York"
 *               created_at: "2024-10-23T10:00:00Z"
 *               updated_at: "2024-10-23T10:00:00Z"
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.get('/:uid', getDoctorByUID);

/**
 * @swagger
 * /doctors/{uid}:
 *   put:
 *     summary: Update doctor's details
 *     tags: [Doctor]
 *     parameters:
 *       - in: path
 *         name: uid
 *         schema:
 *           type: string
 *         required: true
 *         description: The UID of the doctor (User UID)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               specialty:
 *                 type: string
 *                 example: "Cardiology"
 *               location:
 *                 type: string
 *                 example: "New York"
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_uid:
 *                   type: string
 *                   example: "abc123"
 *                 specialty:
 *                   type: string
 *                   example: "Cardiology"
 *                 location:
 *                   type: string
 *                   example: "New York"
 *                 updated_at:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 */
router.put('/:uid', updateDoctor);

export default router;

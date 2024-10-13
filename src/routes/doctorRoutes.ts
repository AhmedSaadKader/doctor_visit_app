import express from 'express';
import { getDoctorByUID, updateDoctor } from '../controllers/doctorController';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Doctor:
 *       type: object
 *       required:
 *         - user_uid
 *         - specialty
 *         - location
 *       properties:
 *         user_uid:
 *           type: string
 *           description: The Firebase UID, referencing the user
 *         specialty:
 *           type: string
 *           description: The doctor's specialty
 *         location:
 *           type: string
 *           description: The location of the doctor
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: When the doctor was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: When the doctor information was last updated
 */

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
 *                 created_at:
 *                   type: string
 *                   format: date-time
 *                 updated_at:
 *                   type: string
 *                   format: date-time
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

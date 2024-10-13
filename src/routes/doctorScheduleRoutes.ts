import express from 'express';
import doctorScheduleController from '../controllers/doctorSchedulecontroller';

const router = express.Router();

// Route to create a new schedule
router.post('/create', doctorScheduleController.createSchedule);

// Route to get all schedules for a doctor
router.get('/:doctor_id', doctorScheduleController.getSchedulesByDoctor);

// Route to update a schedule
router.put('/update', doctorScheduleController.updateSchedule);

// Route to delete a schedule
router.delete('/delete', doctorScheduleController.deleteSchedule);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     DoctorSchedule:
 *       type: object
 *       required:
 *         - doctor_id
 *         - day_of_week
 *         - start_time
 *         - end_time
 *       properties:
 *         doctor_id:
 *           type: string
 *           description: Firebase UID of the doctor
 *           example: "abc123"
 *         day_of_week:
 *           type: string
 *           description: Day of the week for the schedule
 *           example: "Monday"
 *         start_time:
 *           type: string
 *           format: time
 *           description: Start time for the schedule
 *           example: "09:00:00"
 *         end_time:
 *           type: string
 *           format: time
 *           description: End time for the schedule
 *           example: "17:00:00"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the schedule was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the schedule was last updated
 *
 * /schedules/create:
 *   post:
 *     summary: Create a new schedule for a doctor
 *     tags: [DoctorSchedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctor_id:
 *                 type: string
 *                 description: Firebase UID of the doctor
 *                 example: "abc123"
 *               day_of_week:
 *                 type: string
 *                 description: Day of the week
 *                 example: "Monday"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: Start time for the schedule
 *                 example: "09:00:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: End time for the schedule
 *                 example: "17:00:00"
 *     responses:
 *       201:
 *         description: Schedule successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorSchedule'
 *       422:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 *
 * /schedules/{doctor_id}:
 *   get:
 *     summary: Get all schedules for a specific doctor
 *     tags: [DoctorSchedule]
 *     parameters:
 *       - in: path
 *         name: doctor_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Firebase UID of the doctor
 *         example: "abc123"
 *     responses:
 *       200:
 *         description: List of schedules for the doctor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DoctorSchedule'
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Internal server error
 *
 * /schedules/update:
 *   put:
 *     summary: Update an existing doctor schedule
 *     tags: [DoctorSchedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctor_id:
 *                 type: string
 *                 description: Firebase UID of the doctor
 *                 example: "abc123"
 *               day_of_week:
 *                 type: string
 *                 description: Day of the week for the schedule
 *                 example: "Monday"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: Start time for the schedule
 *                 example: "09:00:00"
 *               end_time:
 *                 type: string
 *                 format: time
 *                 description: Updated end time for the schedule
 *                 example: "18:00:00"
 *     responses:
 *       200:
 *         description: Schedule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorSchedule'
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Internal server error
 *
 * /schedules/delete:
 *   delete:
 *     summary: Delete an existing doctor schedule
 *     tags: [DoctorSchedule]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctor_id:
 *                 type: string
 *                 description: Firebase UID of the doctor
 *                 example: "abc123"
 *               day_of_week:
 *                 type: string
 *                 description: Day of the week for the schedule
 *                 example: "Monday"
 *               start_time:
 *                 type: string
 *                 format: time
 *                 description: Start time for the schedule
 *                 example: "09:00:00"
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DoctorSchedule'
 *       404:
 *         description: Schedule not found
 *       500:
 *         description: Internal server error
 */

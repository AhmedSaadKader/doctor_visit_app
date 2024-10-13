import { Router } from 'express';
import AppointmentController from '../controllers/appointmentController';

const router = Router();

// Create a new appointment
router.post('/', AppointmentController.createAppointment);

// Get appointments by patient ID
router.get(
  '/patient/:patient_id',
  AppointmentController.getAppointmentsByPatient
);

// Get appointments by doctor ID
router.get('/doctor/:doctor_id', AppointmentController.getAppointmentsByDoctor);

// Update appointment status
router.patch('/', AppointmentController.updateAppointmentStatus);

// Delete an appointment
router.delete('/:id', AppointmentController.deleteAppointment);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Appointment:
 *       type: object
 *       required:
 *         - patient_id
 *         - doctor_id
 *         - schedule_id
 *       properties:
 *         id:
 *           type: integer
 *           description: Unique identifier for the appointment
 *           example: 1
 *         patient_id:
 *           type: string
 *           description: ID of the patient
 *           example: "patient123"
 *         doctor_id:
 *           type: string
 *           description: ID of the doctor
 *           example: "doctor123"
 *         schedule_id:
 *           type: integer
 *           description: ID of the doctor's schedule
 *           example: 1
 *         status:
 *           type: string
 *           description: Status of the appointment
 *           example: "pending"
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the appointment was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the appointment was last updated
 *
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Appointment'
 *     responses:
 *       201:
 *         description: Appointment successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Failed to create appointment
 *   patch:
 *     summary: Update appointment status
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment status updated successfully
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Failed to update appointment status
 *
 * /appointments/patient/{patient_id}:
 *   get:
 *     summary: Get appointments by patient ID
 *     tags: [Appointments]
 *     parameters:
 *       - name: patient_id
 *         in: path
 *         required: true
 *         description: ID of the patient
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of appointments for the patient
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Failed to retrieve appointments
 *
 * /appointments/doctor/{doctor_id}:
 *   get:
 *     summary: Get appointments by doctor ID
 *     tags: [Appointments]
 *     parameters:
 *       - name: doctor_id
 *         in: path
 *         required: true
 *         description: ID of the doctor
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of appointments for the doctor
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Appointment'
 *       500:
 *         description: Failed to retrieve appointments
 *
 * /appointments/{id}:
 *   delete:
 *     summary: Delete an appointment
 *     tags: [Appointments]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the appointment to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Appointment deleted successfully
 *       404:
 *         description: Appointment not found
 *       500:
 *         description: Failed to delete appointment
 */

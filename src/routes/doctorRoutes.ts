import express from 'express';
import { getDoctorByUID, updateDoctor } from '../controllers/doctorController';

const router = express.Router();

// Route to get doctor details by user UID
router.get('/:uid', getDoctorByUID);

// Route to update doctor's details by user UID
router.put('/:uid', updateDoctor);

export default router;

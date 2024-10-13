import { Request, Response } from 'express';
import AppointmentModel from '../models/appointmentModel';

class AppointmentController {
  // Create a new appointment
  async createAppointment(req: Request, res: Response) {
    const { patient_id, doctor_id, schedule_id, status } = req.body;

    try {
      const appointment = await AppointmentModel.createAppointment(
        patient_id,
        doctor_id,
        schedule_id,
        status
      );
      res.status(201).json(appointment);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to create appointment',
        error: (error as Error).message
      });
    }
  }

  // Get appointments by patient ID
  async getAppointmentsByPatient(req: Request, res: Response) {
    const { patient_id } = req.params;

    try {
      const appointments =
        await AppointmentModel.getAppointmentsByPatient(patient_id);
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to retrieve appointments',
        error: (error as Error).message
      });
    }
  }

  // Get appointments by doctor ID
  async getAppointmentsByDoctor(req: Request, res: Response) {
    const { doctor_id } = req.params;

    try {
      const appointments =
        await AppointmentModel.getAppointmentsByDoctor(doctor_id);
      res.status(200).json(appointments);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to retrieve appointments',
        error: (error as Error).message
      });
    }
  }

  // Update appointment status
  async updateAppointmentStatus(req: Request, res: Response) {
    const { id, status } = req.body;

    try {
      const updatedAppointment = await AppointmentModel.updateAppointmentStatus(
        id,
        status
      );
      if (updatedAppointment) {
        res.status(200).json(updatedAppointment);
      } else {
        res.status(404).json({ message: 'Appointment not found' });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Failed to update appointment status',
        error: (error as Error).message
      });
    }
  }

  // Delete an appointment
  async deleteAppointment(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const deletedAppointment = await AppointmentModel.deleteAppointment(
        parseInt(id)
      );
      if (deletedAppointment) {
        res.status(200).json({ message: 'Appointment deleted successfully' });
      } else {
        res.status(404).json({ message: 'Appointment not found' });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Failed to delete appointment',
        error: (error as Error).message
      });
    }
  }
}

export default new AppointmentController();

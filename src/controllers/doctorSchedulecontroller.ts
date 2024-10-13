import { Request, Response } from 'express';
import DoctorScheduleModel from '../models/doctorScheduleModel';

class DoctorScheduleController {
  // Create a new doctor schedule
  async createSchedule(req: Request, res: Response) {
    const { doctor_id, day_of_week, start_time, end_time } = req.body;

    try {
      const schedule = await DoctorScheduleModel.createSchedule(
        doctor_id,
        day_of_week,
        start_time,
        end_time
      );
      res.status(201).json(schedule);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to create schedule',
        error: (error as Error).message
      });
    }
  }

  // Get schedules by doctor_id
  async getSchedulesByDoctor(req: Request, res: Response) {
    const { doctor_id } = req.params;

    try {
      const schedules =
        await DoctorScheduleModel.getSchedulesByDoctor(doctor_id);
      res.status(200).json(schedules);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to retrieve schedules',
        error: (error as Error).message
      });
    }
  }

  // Update a schedule
  async updateSchedule(req: Request, res: Response) {
    const { doctor_id, day_of_week, start_time, end_time } = req.body;

    try {
      const updatedSchedule = await DoctorScheduleModel.updateSchedule(
        doctor_id,
        day_of_week,
        start_time,
        { end_time }
      );
      if (updatedSchedule) {
        res.status(200).json(updatedSchedule);
      } else {
        res.status(404).json({ message: 'Schedule not found' });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Failed to update schedule',
        error: (error as Error).message
      });
    }
  }

  // Delete a schedule
  async deleteSchedule(req: Request, res: Response) {
    const { doctor_id, day_of_week, start_time } = req.body;

    try {
      const deletedSchedule = await DoctorScheduleModel.deleteSchedule(
        doctor_id,
        day_of_week,
        start_time
      );
      if (deletedSchedule) {
        res.status(200).json({ message: 'Schedule deleted successfully' });
      } else {
        res.status(404).json({ message: 'Schedule not found' });
      }
    } catch (error) {
      res.status(500).json({
        message: 'Failed to delete schedule',
        error: (error as Error).message
      });
    }
  }
}

export default new DoctorScheduleController();

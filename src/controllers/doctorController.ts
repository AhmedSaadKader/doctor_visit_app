import { Request, Response, NextFunction } from 'express';
import { DoctorModel } from '../models/doctorModel';

const doctorModel = new DoctorModel();

// Get doctor details by user UID
export const getDoctorByUID = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { uid } = req.params;

  try {
    const doctor = await doctorModel.findByUserUID(uid);
    if (!doctor) {
      res.status(404).json({ error: `Doctor with UID ${uid} not found` });
      return;
    }

    res.status(200).json(doctor);
    return;
  } catch (error) {
    res.status(500).json(`error: ${(error as Error).message}`);
  }
};

// Update doctor's details
export const updateDoctor = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { uid } = req.params;
  const { specialty, location } = req.body;

  try {
    const updatedDoctor = await doctorModel.update(uid, {
      specialty,
      location
    });
    res.status(200).json(updatedDoctor);
    return;
  } catch (error) {
    res.status(500).json(`error: ${(error as Error).message}`);
  }
};

import { Request, Response, NextFunction } from 'express';
import { DoctorModel } from '../models/doctorModel';

const doctorModel = new DoctorModel();

// Get doctor details by user UID
export const getDoctorByUID = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { uid } = req.params;

  try {
    const doctor = await doctorModel.findByUserUID(uid);
    if (!doctor) {
      return res
        .status(404)
        .json({ error: `Doctor with UID ${uid} not found` });
    }

    return res.status(200).json(doctor);
  } catch (error) {
    next(error);
  }
};

// Update doctor's details
export const updateDoctor = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { uid } = req.params;
  const { specialty, location } = req.body;

  try {
    const updatedDoctor = await doctorModel.update(uid, {
      specialty,
      location
    });
    return res.status(200).json(updatedDoctor);
  } catch (error) {
    next(error);
  }
};

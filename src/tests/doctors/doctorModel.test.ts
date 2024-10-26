import {
  describe,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  it
} from '@jest/globals';
import { DoctorModel } from '../../models/doctorModel';
import { connectionSQLResult } from '../../utils/sql_query';
import { sqlClient } from '../../database';
import { UserModel } from '../../models/userModel';

describe('Doctor Model Unit Tests', () => {
  let doctorModel: DoctorModel;
  let newUser;

  beforeEach(async () => {
    doctorModel = new DoctorModel();
    const uniqueEmail = `john.doe@example.com`;

    newUser = await new UserModel().create({
      uid: 'unique_uid_123456',
      first_name: 'John',
      last_name: 'Doe',
      email: uniqueEmail,
      user_type: 'doctor',
      image_url: 'http://example.com/image.jpg'
    });
  });

  afterEach(async () => {
    await connectionSQLResult('DELETE FROM doctors', []);
    await connectionSQLResult('DELETE FROM users', []);
  });

  afterAll(async () => {
    await sqlClient.end();
  });

  // Test for creating a new doctor
  it('should create a new doctor successfully', async () => {
    await doctorModel.create({
      user_uid: 'unique_uid_123456',
      specialty: 'Cardiology',
      location: 'New York'
    });
    const foundDoctor = await doctorModel.findByUserUID('unique_uid_123456');

    expect(foundDoctor.user_uid).toBe('unique_uid_123456');
    expect(foundDoctor.specialty).toBe('Cardiology');
    expect(foundDoctor.location).toBe('New York');
  });

  // Test for finding a doctor by user_uid
  it('should find a doctor by user_uid', async () => {
    await doctorModel.create({
      user_uid: 'unique_uid_123456',
      specialty: 'Cardiology',
      location: 'New York'
    });

    const foundDoctor = await doctorModel.findByUserUID('unique_uid_123456');
    expect(foundDoctor).toBeDefined();
    expect(foundDoctor!.specialty).toBe('Cardiology');
  });

  // Test for retrieving all doctors with user details
  it('should retrieve all doctors', async () => {
    await doctorModel.create({
      user_uid: 'unique_uid_123456',
      specialty: 'Cardiology',
      location: 'New York'
    });

    const doctors = await doctorModel.findAllDoctors();
    expect(doctors.length).toBeGreaterThan(0);
  });

  // Test for updating a doctor's details
  it('should update doctor details', async () => {
    await doctorModel.create({
      user_uid: 'unique_uid_123456',
      specialty: 'Cardiology',
      location: 'New York'
    });

    const updatedDoctor = await doctorModel.update('unique_uid_123456', {
      specialty: 'Neurology',
      location: 'Boston'
    });

    expect(updatedDoctor.specialty).toBe('Neurology');
    expect(updatedDoctor.location).toBe('Boston');
  });

  // Test for deleting a doctor by user_uid
  it('should delete a doctor by user_uid successfully', async () => {
    await doctorModel.create({
      user_uid: 'unique_uid_1234566',
      specialty: 'Cardiology',
      location: 'New York'
    });

    await doctorModel.deleteByUserUID('unique_uid_1234566');

    const doctor = await doctorModel.findByUserUID('unique_uid_1234566');
    expect(doctor).toBeNull();
  });
});

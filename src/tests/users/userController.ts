import {
  describe,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  it
} from '@jest/globals';
import supertest from 'supertest';
import { UserModel } from '../../models/userModel';
import { DoctorModel } from '../../models/doctorModel';
import app from '../..';

const request = supertest(app);

describe('User Routes and Controllers', () => {
  const mockUser = {
    email: 'testss@example.com',
    password: 'password123',
    first_name: 'John',
    last_name: 'Doe',
    user_type: 'patient'
  };

  const mockDoctor = {
    email: 'doctorss@example.com',
    password: 'password123',
    first_name: 'Jane',
    last_name: 'Smith',
    user_type: 'doctor',
    specialty: 'Cardiology',
    location: 'New York'
  };

  let userModel: UserModel;
  let doctorModel: DoctorModel;
  let accessToken: string;

  beforeAll(async () => {
    userModel = new UserModel();
    doctorModel = new DoctorModel();
  });

  beforeEach(async () => {
    // Clean up the test database before each test
    await userModel.deleteAll();
    await doctorModel.deleteAll();
  });

  afterAll(async () => {
    // Final cleanup after all tests
    await userModel.deleteAll();
    await doctorModel.deleteAll();
  });

  describe('POST /api/v1/users/register', () => {
    it('should register a new patient user', async () => {
      const response = await request
        .post('/api/v1/users/register')
        .send(mockUser);

      expect(response.status).toBe(201);
      expect(response.body.message).toBeDefined();
      expect(response.body.user.email).toBe(mockUser.email);
    });

    it('should register a new doctor user', async () => {
      const response = await request
        .post('/api/v1/users/register')
        .send(mockDoctor);

      expect(response.status).toBe(201);
      expect(response.body.message).toBeDefined();
      expect(response.body.user.email).toBe(mockDoctor.email);
    });

    it('should handle missing required fields', async () => {
      const response = await request
        .post('/api/v1/users/register')
        .send({ email: 'test@example.com' });

      expect(response.status).toBe(422);
      expect(response.body.error).toBeDefined();
    });

    it('should handle existing email', async () => {
      // First registration
      await request.post('/api/v1/users/register').send(mockUser);

      // Second registration with same email
      const response = await request
        .post('/api/v1/users/register')
        .send(mockUser);

      expect(response.status).toBe(409);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/v1/users/login', () => {
    beforeEach(async () => {
      // Register a user before each login test
      await request.post('/api/v1/users/register').send(mockUser);
    });

    it('should login a user', async () => {
      const response = await request.post('/api/v1/users/login').send({
        email: mockUser.email,
        password: mockUser.password
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
      expect(response.body.user.email).toBe(mockUser.email);
      expect(response.headers['set-cookie']).toBeDefined();

      // Save token for other tests
      accessToken = response.body.user.token;
    });

    it('should handle invalid credentials', async () => {
      const response = await request.post('/api/v1/users/login').send({
        email: mockUser.email,
        password: 'wrongpassword'
      });

      expect(response.status).toBe(401);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('POST /api/v1/users/logout', () => {
    it('should logout a user', async () => {
      const response = await request
        .post('/api/v1/users/logout')
        .set('Cookie', [`access_token=${accessToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User logged out successfully!');
    });
  });

  describe('POST /api/v1/users/reset-password', () => {
    it('should send password reset email', async () => {
      const response = await request
        .post('/api/v1/users/reset-password')
        .send({ email: mockUser.email });

      expect(response.status).toBe(200);
      expect(response.body.message).toBeDefined();
    });

    it('should handle non-existent email', async () => {
      const response = await request
        .post('/api/v1/users/reset-password')
        .send({ email: 'nonexistent@example.com' });

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('GET /api/v1/users/:uid', () => {
    let userId: string;

    beforeEach(async () => {
      // Register and login a user to get the user ID
      await request.post('/api/v1/users/register').send(mockUser);
      const loginResponse = await request.post('/api/v1/users/login').send({
        email: mockUser.email,
        password: mockUser.password
      });
      userId = loginResponse.body.user.uid;
      accessToken = loginResponse.body.user.token;
    });

    it('should get user details', async () => {
      const response = await request
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe(mockUser.email);
    });

    it('should handle non-existent user', async () => {
      const response = await request
        .get('/api/v1/users/nonexistentid')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBeDefined();
    });
  });

  describe('PUT /api/v1/users/:uid', () => {
    let userId: string;

    beforeEach(async () => {
      // Register and login a user to get the user ID
      await request.post('/api/v1/users/register').send(mockUser);
      const loginResponse = await request.post('/api/v1/users/login').send({
        email: mockUser.email,
        password: mockUser.password
      });
      userId = loginResponse.body.user.uid;
      accessToken = loginResponse.body.user.token;
    });

    it('should update user details', async () => {
      const updates = {
        first_name: 'Jane',
        last_name: 'Smith'
      };

      const response = await request
        .put(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updates);

      expect(response.status).toBe(200);
      expect(response.body.user.first_name).toBe(updates.first_name);
      expect(response.body.user.last_name).toBe(updates.last_name);
    });
  });

  describe('DELETE /api/v1/users/:uid', () => {
    let userId: string;

    beforeEach(async () => {
      // Register and login a user to get the user ID
      await request.post('/api/v1/users/register').send(mockUser);
      const loginResponse = await request.post('/api/v1/users/login').send({
        email: mockUser.email,
        password: mockUser.password
      });
      userId = loginResponse.body.user.uid;
      accessToken = loginResponse.body.user.token;
    });

    it('should delete a user', async () => {
      const response = await request
        .delete(`/api/v1/users/${userId}`)
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        'User deleted successfully from both Firebase and PostgreSQL'
      );
    });
  });
});

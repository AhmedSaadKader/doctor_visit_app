import {
  describe,
  expect,
  beforeAll,
  beforeEach,
  afterAll,
  afterEach,
  it
} from '@jest/globals';
import { UserModel } from '../../models/userModel';
import { connectionSQLResult } from '../../utils/sql_query';
import { sqlClient } from '../../database';

describe('User Model Unit Tests', () => {
  let userModel: UserModel;

  beforeEach(() => {
    userModel = new UserModel();
  });

  afterEach(async () => {
    // Clean up test data
    await connectionSQLResult('DELETE FROM users WHERE email LIKE $1', [
      'john.doe%'
    ]);
  });

  afterAll(async () => {
    await sqlClient.end();
  });

  // Test for creating a new user
  it('should create a new user successfully', async () => {
    const newUser = await userModel.create({
      uid: 'unique_uid_12345',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      user_type: 'patient',
      image_url: 'http://example.com/image.jpg'
    });

    expect(newUser.email).toBe('john.doe@example.com');
    expect(newUser.first_name).toBe('John');
    expect(newUser.user_type).toBe('patient');
  });

  // Test for finding a user by UID
  it('should find a user by UID', async () => {
    const user = await userModel.create({
      uid: 'unique_uid_12345',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      user_type: 'patient'
    });

    const foundUser = await userModel.findByUID('unique_uid_12345');
    expect(foundUser).toBeDefined();
    expect(foundUser!.email).toBe('john.doe@example.com');
  });

  // Test for retrieving all users
  it('should retrieve all users', async () => {
    await userModel.create({
      uid: 'unique_uid_12345',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      user_type: 'patient'
    });

    const users = await userModel.findAllUsers();
    expect(users.length).toBeGreaterThan(0);
  });

  // Test for updating a user
  it('should update user details', async () => {
    await userModel.create({
      uid: 'unique_uid_12345',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      user_type: 'patient'
    });

    const updatedUser = await userModel.update('unique_uid_12345', {
      first_name: 'Jane',
      email: 'jane.doe@example.com'
    });

    expect(updatedUser.first_name).toBe('Jane');
    expect(updatedUser.email).toBe('jane.doe@example.com');
  });

  // Test for deleting a user by UID
  it('should delete a user by UID successfully', async () => {
    await userModel.create({
      uid: 'unique_uid_123456',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      user_type: 'patient'
    });

    await userModel.deleteByUID('unique_uid_123456');

    const user = await userModel.findByUID('unique_uid_123456');
    expect(user).toBeNull();
  });
});

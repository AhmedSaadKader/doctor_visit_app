import { describe, expect, afterAll, it } from '@jest/globals';
import request from 'supertest';
import app, { server } from '../index';

describe("GET API '/'", () => {
  it('should return "doctor_visit"', async () => {
    const res = await request(app).get('/').expect(200);
    expect(res.text).toBe('doctor_visit');
  });

  afterAll((done) => {
    server.close(done);
  });
});

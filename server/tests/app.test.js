const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../server');

let mongoServer;

// Setup test database
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Cleanup after tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Health Check', () => {
  test('GET /health should return server status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('CareerVerse AI Backend is running');
  });
});

describe('Authentication', () => {
  test('POST /api/auth/register should create a new user', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(userData.email);
    expect(response.body.data.token).toBeDefined();
  });

  test('POST /api/auth/login should authenticate user', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.user.email).toBe(loginData.email);
    expect(response.body.data.token).toBeDefined();
  });
});

describe('Jobs API', () => {
  test('GET /api/jobs should return jobs list', async () => {
    const response = await request(app)
      .get('/api/jobs')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('jobs');
    expect(response.body.data).toHaveProperty('pagination');
  });

  test('GET /api/jobs/stats should return job statistics', async () => {
    const response = await request(app)
      .get('/api/jobs/stats')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('totalJobs');
  });
});

describe('Gigs API', () => {
  test('GET /api/gigs should return gigs list', async () => {
    const response = await request(app)
      .get('/api/gigs')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('gigs');
    expect(response.body.data).toHaveProperty('pagination');
  });
});




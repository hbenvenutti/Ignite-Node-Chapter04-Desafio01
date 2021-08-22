import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../../app'

let connection: Connection;

describe('Create User Use Case', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  })

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('should create a user', async () => {
    const response = await request(app)
      .post('/api/v1/users/')
      .send({name: 'foo', email: 'foo@bar.com', password: 'password'});

      expect(response.status).toEqual(201);
  })


  it('should not create a duplicate user', async () => {
    await request(app)
    .post('/api/v1/users/')
    .send({name: 'foo', email: 'foo@bar.com', password: 'password'});

    const response = await request(app)
    .post('/api/v1/users/')
    .send({name: 'foo', email: 'foo@bar.com', password: 'password'});

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('User already exists');
  })
})

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

  it('should authenticate the user', async () => {
    await request(app)
      .post('/api/v1/users/')
      .send({name: 'foo', email: 'foo@bar.com', password: 'password'});

    const response = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'foo@bar.com', password: 'password' });

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  it('should not authenticate an inexistent user', async () => {
    const response = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'wrong@bar.com', password: 'password' });

    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Incorrect email or password');

  });

  it('should not authenticate user with incorrect password ', async () => {
    const response = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'foo@bar.com', password: 'wrong-password' });

    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Incorrect email or password');

  })


});

import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../../app'

let connection: Connection;

describe('Create User Use Case', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app)
      .post('/api/v1/users/')
      .send({name: 'foo', email: 'foo@bar.com', password: 'password'});
  })

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  })

  it('should show a user profile', async () => {
    const session = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'foo@bar.com', password: 'password' });

    const { token } = session.body

    const response = await request(app)
      .get('/api/v1/profile')
      .set({ Authorization: `Bearer ${token}`});

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('created_at');
    expect(response.body).toHaveProperty('updated_at');
    expect(response.body.email).toEqual('foo@bar.com');
    expect(response.body.name).toEqual('foo');
  });

  it('should not show user profile with invalid token', async () => {
    const response = await request(app)
      .get('/api/v1/profile')
      .set({ Authorization: `Bearer fake.token`})
    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('JWT invalid token!');
  })

  it('should not show profile of unauthenticated user', async () => {
    const response = await request(app)
      .get('/api/v1/profile')

    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('JWT token is missing!');

  })
});

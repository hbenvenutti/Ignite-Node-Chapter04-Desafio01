import request from 'supertest';
import { Connection, createConnection } from 'typeorm';
import { app } from '../../../../../app'
import {v4 as uuid} from 'uuid'

let connection: Connection;

describe('Create User Use Case', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    await request(app)
      .post('/api/v1/users/')
      .send({name: 'foo', email: 'foo@bar.com', password: 'password'});
  });

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should get the statement operation', async () => {
    const session = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'foo@bar.com', password: 'password' });

    const { token } = session.body

    const statement = await request(app)
      .post('/api/v1/statements/deposit')
      .send({amount: 15, description: 'deposit for test'})
      .set({Authorization: `Bearer ${ token }`})

    const { id } = statement.body;

    const response = await request(app)
      .get(`/api/v1/statements/${ id }`)
      .set({Authorization: `Bearer ${ token }`});

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('type');
    expect(response.body).toHaveProperty('amount');
    expect(response.body).toHaveProperty('user_id');
    expect(response.body).toHaveProperty('description');
    expect(response.body).toHaveProperty('created_at');
    expect(response.body).toHaveProperty('updated_at');

  });

  it('should not get the statement operation of inexistent user', async () => {
    const session = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'foo@bar.com', password: 'password' });

    const { token } = session.body

    const statement = await request(app)
      .post('/api/v1/statements/deposit')
      .send({amount: 15, description: 'deposit for test'})
      .set({Authorization: `Bearer ${ token }`})

    const { id } = statement.body;


    const response = await request(app)
      .get(`/api/v1/statements/${ id }`)

    expect(response.status).toEqual(401);
  });

  it('should not get an inexistent statement operation', async () => {
    const session = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'foo@bar.com', password: 'password' });

    const { token } = session.body

    await request(app)
      .post('/api/v1/statements/deposit')
      .send({amount: 15, description: 'deposit for test'})
      .set({Authorization: `Bearer ${ token }`})

    const id = uuid();

    const response = await request(app)
      .get(`/api/v1/statements/${id}`)
      .set({Authorization: `Bearer ${ token }`})

    expect(response.status).toEqual(404);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Statement not found')
  });
});

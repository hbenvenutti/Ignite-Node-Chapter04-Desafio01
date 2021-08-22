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
  });

  it('should create a deposit statement', async () => {
    const session = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'foo@bar.com', password: 'password' });

    const { token } = session.body

    const response = await request(app)
      .post('/api/v1/statements/deposit')
      .send({amount: 15, description: 'deposit for test'})
      .set({Authorization: `Bearer ${ token }`})

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.type).toEqual('deposit');
    expect(response.body).toHaveProperty('created_at');
    expect(response.body).toHaveProperty('updated_at');

  });

  it('should create a withdraw statement', async () => {
    const session = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'foo@bar.com', password: 'password' });

    const { token } = session.body

    const response = await request(app)
      .post('/api/v1/statements/withdraw')
      .send({amount: 5, description: 'withdraw for test'})
      .set({Authorization: `Bearer ${ token }`})

    expect(response.status).toEqual(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.type).toEqual('withdraw');
    expect(response.body).toHaveProperty('created_at');
    expect(response.body).toHaveProperty('updated_at');

  });

  it('should not make a statement for unauthenticated user', async () => {
    const response = await request(app)
    .post('/api/v1/statements/deposit')
    .send({amount: 15, description: 'deposit for test'})

    expect(response.status).toEqual(401);
  });

  it('should not create a statement if balance < amount', async () => {
    const session = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'foo@bar.com', password: 'password' });

    const { token } = session.body

    const response = await request(app)
     .post('/api/v1/statements/withdraw')
     .send({amount: 35, description: 'withdraw for test'})
     .set({Authorization: `Bearer ${ token }`})

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toEqual('Insufficient funds');
  })

});

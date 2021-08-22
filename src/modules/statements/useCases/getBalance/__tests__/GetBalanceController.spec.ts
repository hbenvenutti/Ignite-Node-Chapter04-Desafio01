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

    const session = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'foo@bar.com', password: 'password' });

    const { token } = session.body

    await request(app)
      .post('/api/v1/statements/deposit')
      .send({amount: 15, description: 'deposit for test'})
      .set({Authorization: `Bearer ${ token }`})
  })

  afterAll(async() => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should get the balance', async () => {
    const session = await request(app)
      .post('/api/v1/sessions')
      .send({ email: 'foo@bar.com', password: 'password' });

    const { token } = session.body

    const response = await request(app)
      .get('/api/v1/statements/balance')
      .set({Authorization: `Bearer ${ token }`})

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty('balance');
    expect(response.body.balance).toEqual(15);
    expect(response.body).toHaveProperty('statement');
    expect(response.body.statement.length).toEqual(1);


  });

  it('should not get balance for unauthenticated user', async () => {
    const response = await request(app)
    .get('/api/v1/statements/balance');

    expect(response.status).toEqual(401);
    expect(response.body).toHaveProperty('message');
  })
});

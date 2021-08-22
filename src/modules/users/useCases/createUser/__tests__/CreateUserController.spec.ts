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

  it('should create a user', async () => {})

  it('should not create a duplicate user', async () => {})
})

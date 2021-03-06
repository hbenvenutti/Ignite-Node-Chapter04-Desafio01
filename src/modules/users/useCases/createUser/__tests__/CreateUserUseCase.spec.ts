import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "../CreateUserError";
import { CreateUserUseCase } from "../CreateUserUseCase"

describe('Create User Use Case', () => {
  let usersRepository: InMemoryUsersRepository;
  let createUser: CreateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    createUser = new CreateUserUseCase(usersRepository)
  })

  it('should create a user', async () => {
    const user = await createUser.execute(
      {
        name: 'name',
        email: 'foo@bar.com',
        password: 'password'
      });

    expect(user).toHaveProperty('id')
  })

  it('should not create a duplicate user', async () => {
    await createUser.execute(
      {
        name: 'name',
        email: 'foo@bar.com',
        password: 'password'
      }
    );

    expect(async () => {
      await createUser.execute(
        {
          name: 'name',
          email: 'foo@bar.com',
          password: 'password'
        }
      )
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})

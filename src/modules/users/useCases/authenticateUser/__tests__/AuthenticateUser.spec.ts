import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "../IncorrectEmailOrPasswordError";

describe('Authenticate User', () => {
  let usersRepository: InMemoryUsersRepository;
  let authenticateUser: AuthenticateUserUseCase;

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository();
    authenticateUser = new AuthenticateUserUseCase(usersRepository);1
  })

  it('should authenticate the user', async () => {
    const email = 'foo@bar.com';
    const password = await hash('password', 8);
    await usersRepository.create({ name: 'foo', email, password})

    const response = await authenticateUser.execute({email, password: 'password'})

    expect(response).toHaveProperty('user');
    expect(response).toHaveProperty('token');
  });

  it('should not authenticate an inexistent user', async () => {
    const email = 'foo@bar.com';

    expect(async () => {
      await authenticateUser.execute({email, password: 'password'})
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('should not authenticate user with incorrect password ', async () => {
    const email = 'foo@bar.com';
    const password = await hash('password', 8);
    await usersRepository.create({ name: 'foo', email, password})

    expect(async () => {
      await authenticateUser.execute({email, password: 'wrong-password'})
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
});

import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../AuthenticateUserUseCase";

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
  })
});

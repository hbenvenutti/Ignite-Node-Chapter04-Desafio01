import { hash } from "bcryptjs";
import { User } from "../../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "../GetBalanceError";
import { GetBalanceUseCase } from "../GetBalanceUseCase";

describe('Get Balance', () => {
  let usersRepository: InMemoryUsersRepository;
  let statementsRepository: InMemoryStatementsRepository;
  let getBalance: GetBalanceUseCase;
  let user: User;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getBalance = new GetBalanceUseCase(statementsRepository, usersRepository);

    user = await usersRepository.create({
      name: 'foo',
      email: 'foo@example.com',
      password: await hash('password', 8)
    });
  })

  it('should get the balance', async () => {
    const balance = await getBalance.execute({ user_id: user.id! });

    expect(balance).toHaveProperty('balance');
    expect(balance).toHaveProperty('statement');
  });

  it('should not get balance of inexistent user', async () => {
    expect(async () => {
      await getBalance.execute({ user_id: 'wrong-id' });
    }).rejects.toBeInstanceOf(GetBalanceError);

  })
});

import { hash } from "bcryptjs";
import { User } from "../../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../CreateStatementUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Create Statement', () => {
  let statementsRepository: InMemoryStatementsRepository;
  let usersRepository: InMemoryUsersRepository;
  let createStatement: CreateStatementUseCase;
  let user: User;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository()
    statementsRepository = new InMemoryStatementsRepository();
    createStatement = new CreateStatementUseCase(usersRepository, statementsRepository);

    user = await usersRepository.create(
      {
        name: 'foo',
        email: 'foo@bar.com',
        password: await hash('password', 8)
      }
    );
  });

  it('should create a deposit statement', async () => {
    const statement = await createStatement.execute(
      {
        user_id: user.id!,
        amount: 10,
        description: 'description',
        type: 'deposit' as OperationType
      }
    );

    expect(statement).toHaveProperty('id');
  });

  it('should create a withdraw statement', async () => {
    await createStatement.execute(
      {
        user_id: user.id!,
        amount: 10,
        description: 'description',
        type: 'deposit' as OperationType
      }
    );

    const statement = await createStatement.execute(
      {
        user_id: user.id!,
        amount: 5,
        description: 'description',
        type: 'withdraw' as OperationType
      }
    );

    expect(statement).toHaveProperty('id');
  });
})

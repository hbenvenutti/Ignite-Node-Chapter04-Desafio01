import { hash } from "bcryptjs";
import { User } from "../../../../users/entities/User";
import { InMemoryUsersRepository } from "../../../../users/repositories/in-memory/InMemoryUsersRepository";
import { Statement } from "../../../entities/Statement";
import { InMemoryStatementsRepository } from "../../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "../GetStatementOperationError";
import { GetStatementOperationUseCase } from "../GetStatementOperationUseCase";


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe('Get Statement Operation', () => {
  let usersRepository: InMemoryUsersRepository;
  let statementsRepository: InMemoryStatementsRepository;
  let getStatementOperation: GetStatementOperationUseCase;
  let user: User;
  let statement: Statement;

  beforeEach(async () => {
    usersRepository = new InMemoryUsersRepository();
    statementsRepository = new InMemoryStatementsRepository();
    getStatementOperation = new GetStatementOperationUseCase(usersRepository, statementsRepository);

    user = await usersRepository.create({
      name: 'foo',
      email: 'foo@example.com',
      password: await hash('password', 8)
    });

    statement = await statementsRepository.create({
      user_id: user.id!,
      amount: 10,
      description: 'description',
      type: 'deposit' as OperationType
    })


  })

  it('should get the statement operation', async () => {
    const statementOperation = await getStatementOperation.execute(
      {
        user_id: user.id!,
        statement_id: statement.id!
      }
    );

    expect(statementOperation).toBeInstanceOf(Statement);
    expect(statementOperation.id).toEqual(statement.id!);
    expect(statementOperation.user_id).toEqual(user.id!);
    expect(statementOperation.description).toEqual('description');
  });

  it('should not get the statement operation of inexistent user', async () => {
    expect(async () => {
      await getStatementOperation.execute(
        {
          user_id: 'wrong-id',
          statement_id: statement.id!
        }
      );
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it('should not get an inexistent statement operation', async () => {
    expect(async () => {
      await getStatementOperation.execute(
        {
          user_id: user.id!,
          statement_id: 'wrong-id'
        }
      );
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
})

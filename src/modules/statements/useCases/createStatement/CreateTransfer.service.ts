import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";


enum OperationType {
  TRANSFER = 'transfer',
}

@injectable()
class CreateTransfer {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute(userId: string, senderId: string, amount: number, description: string, type: OperationType): Promise<Statement>{
    const user = await this.usersRepository.findById(userId);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: userId });

    if (balance < amount) {
      throw new CreateStatementError.InsufficientFunds()
    }

    const statementOperation = await this.statementsRepository.create({
      user_id: userId,
      sender_id: senderId,
      type,
      amount,
      description
    });

    return statementOperation;

  }
}

export default CreateTransfer

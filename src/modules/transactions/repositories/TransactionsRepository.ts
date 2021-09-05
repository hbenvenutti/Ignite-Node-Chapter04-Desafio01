import { getRepository, Repository } from "typeorm";
import Transaction from "../entities/Transaction";
import ITransactionsRepository from "./ITransactionsRepository";

class TransactionsRepository implements ITransactionsRepository{
  private repository: Repository<Transaction>

  constructor() {
    this.repository = getRepository(Transaction)
  }

  async create(user_id: string, recipient_id: string, description: string): Promise<Transaction> {
    const transaction = this.repository.create({
      user_id,
      recipient_id,
      description
    })

    await this.repository.save(transaction)

    return transaction;
  }

}

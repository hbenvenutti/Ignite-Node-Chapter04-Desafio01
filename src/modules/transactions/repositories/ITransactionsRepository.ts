import Transaction from "../entities/Transaction";

interface ITransactionsRepository {
  create(user_id: string, recipient_id: string, description: string): Promise<Transaction>;
}

export default ITransactionsRepository

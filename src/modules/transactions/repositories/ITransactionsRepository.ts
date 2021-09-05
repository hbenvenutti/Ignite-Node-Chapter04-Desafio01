interface ITransactionsRepository {
  create(user_id: string, recipient_id: string, description: string): Promise<void>;
}

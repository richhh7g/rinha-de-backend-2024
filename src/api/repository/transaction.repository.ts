import { Service } from "typedi";
import { DatabaseManager } from "@app/core/db";
import { TransactionEntity } from "@api/entity";

interface CreateTransactionParams {
  type: string;
  amount: number;
  customerId: number;
  description: string;
}

const REPOSITORY_PATH = {
  isRepositoryPath: true,
};

@Service()
export class TransactionRepository {
  constructor(private readonly database: DatabaseManager) {}

  findTransactionById(id: number) {
    const query = DatabaseManager.loadQuery(
      "find-transaction-by-id.query.sql",
      REPOSITORY_PATH
    );

    return this.database.query<TransactionEntity>(query, [id]);
  }

  async createTransaction(params: CreateTransactionParams) {
    const createTransactionQuery = DatabaseManager.loadQuery(
      "create-transaction.query.sql",
      REPOSITORY_PATH
    );

    const createdAt = Date.now();

    this.database.execute(createTransactionQuery, [
      params.customerId,
      params.type,
      params.amount,
      params.description,
      createdAt,
    ]);
  }
}

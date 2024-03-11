import { Service } from "typedi";
import { DatabaseManager } from "@app/core/db";
import { TransactionEntity } from "@api/entity";

interface CreateTransactionParams {
  type: string;
  amount: number;
  customerId: number;
  description: string;
}

@Service()
export class TransactionRepository {
  constructor(private readonly database: DatabaseManager) {}

  findTransactionById(id: number) {
    const query = DatabaseManager.loadQuery(
      "find-transaction-by-id.query.sql",
      "repository"
    );

    return this.database.query<TransactionEntity>(query, [id]);
  }

  async createTransaction(params: CreateTransactionParams) {
    const createTransactionQuery = DatabaseManager.loadQuery(
      "create-transaction.query.sql",
      "repository"
    );

    const updateCustomerBalanceQuery = DatabaseManager.loadQuery(
      "update-customer-balance.query.sql",
      "repository"
    );

    const createdAt = Date.now();

    await this.database.queryTransaction([
      {
        query: createTransactionQuery,
        params: [
          params.customerId,
          params.type,
          params.amount,
          params.description,
          createdAt,
        ],
      },
      {
        query: updateCustomerBalanceQuery,
        params: [params.customerId],
      },
    ]);
  }
}

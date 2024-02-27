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
      {
        isRepositoryPath: true,
      }
    );

    return this.database.query<TransactionEntity>(query, [id]);
  }

  createTransaction(params: CreateTransactionParams) {
    const query = DatabaseManager.loadQuery("create-transaction.query.sql", {
      isRepositoryPath: true,
    });

    return this.database.query<TransactionEntity>(query, [
      Date.now(),
      params.customerId,
      params.type,
      params.amount,
      params.description,
    ]);
  }
}

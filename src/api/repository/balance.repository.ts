import { Service } from "typedi";
import { DatabaseManager } from "@app/core/db";
import {
  BalanceEntity,
  CustomerBalanceWithTransactionsEntity,
} from "@api/entity";

interface FindCustomerBalanceParams {
  type: string;
  amount: number;
  customerId: number;
}

@Service()
export class BalanceRepository {
  constructor(private readonly database: DatabaseManager) {}

  findCustomerBalance(params: FindCustomerBalanceParams) {
    const query = DatabaseManager.loadQuery(
      "find-customer-balance.query.sql",
      "repository"
    );

    return this.database.query<BalanceEntity>(query, [
      params.customerId,
      params.type,
      params.amount,
    ]);
  }

  findCustomerBalanceWithTransactions(customerId: number) {
    const query = DatabaseManager.loadQuery(
      "find-customer-balance-with-transactions.query.sql",
      "repository"
    );

    return this.database.query<CustomerBalanceWithTransactionsEntity[]>(query, [
      customerId,
    ]);
  }
}

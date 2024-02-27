import { Service } from "typedi";
import { DatabaseManager } from "@app/core/db";
import { BalanceEntity } from "@api/entity";

interface FindCustomerBalanceParams {
  customerId: number;
}

@Service()
export class BalanceRepository {
  constructor(private readonly database: DatabaseManager) {}

  findCustomerBalance(params: FindCustomerBalanceParams) {
    const query = DatabaseManager.loadQuery("find-customer-balance.query.sql", {
      isRepositoryPath: true,
    });

    return this.database.query<BalanceEntity>(query, [params.customerId]);
  }
}

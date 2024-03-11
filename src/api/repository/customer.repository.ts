import { Service } from "typedi";
import { CustomerEntity } from "@api/entity";
import { DatabaseManager } from "@app/core/db";

interface FindCustomerByIdParams {
  id: number;
}

@Service()
export class CustomerRepository {
  constructor(private readonly database: DatabaseManager) {}

  findCustomerById(params: FindCustomerByIdParams) {
    const query = DatabaseManager.loadQuery(
      "find-customer.query.sql",
      "repository"
    );

    return this.database.query<CustomerEntity>(query, [params.id]);
  }
}

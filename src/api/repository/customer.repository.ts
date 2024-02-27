import { Service } from "typedi";
import { DatabaseManager } from "@app/core/db";
import { CustomerEntity } from "@api/entity";

interface FindCustomerByIdParams {
  id: number;
}

@Service()
export class CustomerRepository {
  constructor(private readonly database: DatabaseManager) {}

  findCustomerById(params: FindCustomerByIdParams) {
    const query = DatabaseManager.loadQuery("find-customer.query.sql", {
      isRepositoryPath: true,
    });

    return this.database.query<CustomerEntity>(query, [params.id]);
  }
}

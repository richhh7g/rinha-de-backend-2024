import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import { CustomerModel } from "@api/model";
import { CustomerRepository } from "@api/repository";

@Service()
export class GetCustomerService {
  constructor(private readonly repository: CustomerRepository) {}

  async exec(id: number): Promise<CustomerModel> {
    const customer = await this.repository.findCustomerById({
      id,
    });
    if (!customer) {
      throw new NotFoundError();
    }

    return customer;
  }
}

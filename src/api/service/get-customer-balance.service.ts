import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import { BalanceModel, GetCustomerBalanceServiceInputModel } from "@api/model";
import { BalanceRepository } from "@api/repository";

@Service()
export class GetCustomerBalanceService {
  constructor(private readonly repository: BalanceRepository) {}

  async exec(
    input: GetCustomerBalanceServiceInputModel
  ): Promise<BalanceModel> {
    const balance = await this.repository.findCustomerBalance(input);
    if (!balance) {
      throw new NotFoundError();
    }

    return {
      ...balance,
      customerId: balance.customer_id,
    };
  }
}

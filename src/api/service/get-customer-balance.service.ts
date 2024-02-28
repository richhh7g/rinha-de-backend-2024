import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import { BalanceModel } from "@api/model";
import { BalanceRepository } from "@api/repository";

@Service()
export class GetCustomerBalanceService {
  constructor(private readonly repository: BalanceRepository) {}

  async exec(customerId: number): Promise<BalanceModel> {
    const balance = await this.repository.findCustomerBalance({
      customerId,
    });
    if (!balance) {
      throw new NotFoundError();
    }

    return {
      ...balance,
      customerId: balance.customer_id,
    };
  }
}

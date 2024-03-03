import { Service } from "typedi";
import {
  BalanceBaseModel,
  GetCustomerBalanceServiceInputModel,
} from "@api/model";
import { BalanceRepository } from "@api/repository";
import { UnprocessableError } from "@app/core/error";

@Service()
export class GetCustomerBalanceService {
  constructor(private readonly repository: BalanceRepository) {}

  async exec(
    input: GetCustomerBalanceServiceInputModel
  ): Promise<BalanceBaseModel> {
    const balance = await this.repository.findCustomerBalance(input);
    if (!balance) {
      throw new UnprocessableError();
    }

    return {
      ...balance,
      customerId: balance.customer_id,
    };
  }
}

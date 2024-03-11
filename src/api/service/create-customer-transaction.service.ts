import { Service } from "typedi";
import {
  CreateCustomerTransactionInputModel,
  CreateCustomerTransactionServiceModel,
  TransactionTypeShort,
} from "@api/model";
import { TransactionRepository } from "@api/repository";
import { GetCustomerService } from "./get-customer.service";
import { GetCustomerBalanceService } from "./get-customer-balance.service";

@Service()
export class CreateCustomerTransactionService {
  constructor(
    private readonly getCustomerService: GetCustomerService,
    private readonly getCustomerBalanceService: GetCustomerBalanceService,
    private readonly transactionRepository: TransactionRepository
  ) {}

  async exec(
    input: CreateCustomerTransactionInputModel
  ): Promise<CreateCustomerTransactionServiceModel> {
    const { customerId, amount, description } = input;
    const type = TransactionTypeShort[input.type].toLowerCase();

    const customer = await this.getCustomerService.exec(customerId);

    const commonBalance = {
      type,
      amount,
      customerId: customer.id,
    };

    await this.transactionRepository.createTransaction({
      type,
      amount,
      customerId,
      description,
    });

    const balance = await this.getCustomerBalanceService.exec(commonBalance);

    return {
      limit: balance.limit,
      balance: balance.amount,
    };
  }
}

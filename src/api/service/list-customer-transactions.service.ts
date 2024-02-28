import { Service } from "typedi";
import {
  CreateCustomerTransactionInputModel,
  CreateCustomerTransactionServiceModel,
  TransactionTypeShort,
} from "@api/model";
import { UnprocessableError } from "@app/core/error";
import { GetCustomerService } from "./get-customer.service";
import { GetCustomerBalanceService } from "./get-customer-balance.service";
import { TransactionRepository } from "@api/repository";

@Service()
export class ListCustomerTransactionsService {
  constructor(
    private readonly getCustomerService: GetCustomerService,
    private readonly getCustomerBalanceService: GetCustomerBalanceService,
    private readonly transactionRepository: TransactionRepository
  ) {}

  async exec(
    input: CreateCustomerTransactionInputModel
  ): Promise<CreateCustomerTransactionServiceModel> {
    const { customerId, type, amount, description } = input;

    const customer = await this.getCustomerService.exec(customerId);
    const atualBalance = await this.getCustomerBalanceService.exec(customer.id);

    const isInvalidDebitTransaction =
      TransactionTypeShort.Debit === TransactionTypeShort[type] &&
      atualBalance.amount - amount < -atualBalance.limit;

    if (isInvalidDebitTransaction) {
      throw new UnprocessableError();
    }

    await this.transactionRepository.createTransaction({
      type: TransactionTypeShort[type].toLowerCase(),
      amount,
      customerId,
      description,
    });

    const balance = await this.getCustomerBalanceService.exec(customer.id);

    return {
      limit: balance.limit,
      balance: balance.amount,
    };
  }
}

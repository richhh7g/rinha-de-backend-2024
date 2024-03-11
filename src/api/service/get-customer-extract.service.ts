import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import { BalanceRepository } from "@api/repository";
import { CustomerBalanceTransactionsModel } from "@api/model";
import { GetCustomerService } from "./get-customer.service";
import { mapToCustomerBalanceTransactions } from "./customer-balance-transactions.mapper";

@Service()
export class GetCustomerExtractService {
  constructor(
    private readonly balanceRepository: BalanceRepository,
    private readonly getCustomerService: GetCustomerService
  ) {}

  async exec(customerId: number): Promise<CustomerBalanceTransactionsModel> {
    const customer = await this.getCustomerService.exec(customerId);

    const balanceWithTransactions =
      await this.balanceRepository.findCustomerBalanceWithTransactions(
        customer.id
      );

    if (!balanceWithTransactions) {
      const balance = await this.balanceRepository.findCustomerBalance(
        customer.id
      );

      if (!balance) {
        throw new NotFoundError("Customer balance not found");
      }

      return {
        customerId,
        limit: balance.limit,
        amount: balance.amount,
        transactions: [],
        executionDate: new Date().toISOString(),
      };
    }

    return mapToCustomerBalanceTransactions(balanceWithTransactions);
  }
}

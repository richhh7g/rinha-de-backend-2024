import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import { BalanceRepository } from "@api/repository";
import { CustomerTransactionsModel, TransactionBaseModel } from "@api/model";
import { GetCustomerService } from "./get-customer.service";

@Service()
export class GetCustomerExtractService {
  constructor(
    private readonly balanceRepository: BalanceRepository,
    private readonly getCustomerService: GetCustomerService
  ) {}

  async exec(customerId: number): Promise<CustomerTransactionsModel> {
    const customer = await this.getCustomerService.exec(customerId);

    const balanceWithTransactions =
      await this.balanceRepository.findCustomerBalanceWithTransactions(
        customer.id
      );
    if (!balanceWithTransactions) {
      throw new NotFoundError();
    }

    const balance = balanceWithTransactions.find(
      (firstBalance) => !!firstBalance && firstBalance
    );

    const transactions: TransactionBaseModel[] = balanceWithTransactions.map(
      (transaction) => ({
        id: transaction.transaction_id,
        type: transaction.transaction_type,
        amount: transaction.transaction_amount,
        createdAt: transaction.transaction_created_at,
        customerId: transaction.transaction_customer_id,
        description: transaction.transaction_description,
      })
    );

    return {
      customerId,
      transactions,
      limit: balance!.limit,
      amount: balance!.amount,
    };
  }
}

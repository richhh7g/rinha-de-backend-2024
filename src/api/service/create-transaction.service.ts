import { Service } from "typedi";
import { NotFoundError } from "routing-controllers";
import {
  CreateTransactionServiceInputModel,
  TransactionModel,
} from "@api/model";
import { TransactionRepository } from "@api/repository";

@Service()
export class CreateTransactionService {
  constructor(private readonly repository: TransactionRepository) {}

  async exec(
    input: CreateTransactionServiceInputModel
  ): Promise<TransactionModel> {
    const transaction = await this.repository.createTransaction(input);
    if (!transaction) {
      throw new NotFoundError();
    }

    return {
      ...transaction,
      createdAt: transaction.created_at,
      customerId: transaction.customer_id,
    };
  }
}

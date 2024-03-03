import {
  TransactionBaseModel,
  CustomerBalanceTransactionsModel,
} from "@api/model";
import { CustomerBalanceWithTransactionsEntity } from "@api/entity";

export const mapToCustomerBalanceTransactions = (
  balanceWithTransactions: CustomerBalanceWithTransactionsEntity[]
): CustomerBalanceTransactionsModel => {
  const {
    amount,
    limit,
    customer_id: customerId,
  } = balanceWithTransactions.find(Boolean)!;

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
    limit,
    amount,
    customerId,
    transactions,
  };
};

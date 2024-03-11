import { TransactionTypeShort } from "./transaction.model";

export interface CustomerModel {
  id: number;
  name: string;
}

export interface CreateCustomerTransactionInputModel {
  type: TransactionTypeShort;
  amount: number;
  customerId: number;
  description: string;
}

export interface CreateCustomerTransactionServiceModel {
  limit: number;
  balance: number;
}

export interface GetCustomerBalanceServiceInputModel {
  amount: number;
  type: string;
  customerId: number;
}

export enum TransactionTypeShort {
  D = "Debit",
  C = "Credit",
  Debit = "D",
  Credit = "C",
}

export interface TransactionBaseModel {
  id: number;
  type: string;
  amount: number;
  createdAt: number;
  customerId: number;
  description: string;
}

export interface BalanceBaseModel {
  limit: number;
  amount: number;
  customerId: number;
}

export interface CustomerBalanceTransactionsModel extends BalanceBaseModel {
  executionDate: string;
  transactions: TransactionBaseModel[];
}

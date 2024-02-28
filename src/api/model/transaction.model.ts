export enum TransactionTypeShort {
  D = "Debit",
  C = "Credit",
  Debit = "D",
  Credit = "C",
}

export interface BalanceModel {
  limit: number;
  amount: number;
  customerId: number;
}

export interface TransactionModel {
  id: number;
  type: string;
  amount: number;
  createdAt: number;
  customerId: number;
  description: string;
}

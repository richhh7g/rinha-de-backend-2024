import { BalanceEntity } from "./balance.entity";

export class CustomerEntity {
  readonly id: number;
  readonly name: string;
}

export type CustomerBalanceWithTransactionsEntity = BalanceEntity & {
  transaction_id: number;
  transaction_type: string;
  transaction_amount: number;
  transaction_created_at: number;
  transaction_description: string;
  transaction_customer_id: number;
};

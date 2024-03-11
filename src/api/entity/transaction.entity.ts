import { Service } from "typedi";

@Service()
export class TransactionEntity {
  readonly id: number;
  readonly type: string;
  readonly amount: number;
  readonly created_at: number;
  readonly description: string;
  readonly customer_id: number;
}

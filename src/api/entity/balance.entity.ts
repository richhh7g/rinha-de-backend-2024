import { Service } from "typedi";

@Service()
export class BalanceEntity {
  readonly limit: number;
  readonly amount: number;
  readonly customer_id: number;
}

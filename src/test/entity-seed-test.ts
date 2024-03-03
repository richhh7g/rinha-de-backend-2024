import { faker } from "@faker-js/faker/locale/pt_BR";
import { TransactionEntity } from "@app/api/entity";

export function createTransaction(
  options: Partial<TransactionEntity> = {}
): TransactionEntity {
  const defaulUser: Partial<TransactionEntity> = {
    id: options.id || faker.number.int({ min: 1, max: 1000 }),
    type: options.type || faker.helpers.enumValue({ c: "c", d: "d" }),
    amount: options.amount || faker.number.int({ min: 1, max: 100 }),
    created_at: options.created_at || Date.now(),
    customer_id: options.customer_id || faker.number.int({ min: 1, max: 5 }),
    description: options.description || faker.word.words({ count: 1 }),
  };

  return Object.assign(defaulUser, options) as TransactionEntity;
}

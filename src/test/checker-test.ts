import { expect } from "chai";
import { BalanceEntity } from "@api/entity";
import { CreateCustomerTransactionResponseDTO } from "@api/controller/create-customer-transaction.dto";
import { ResponseError } from "./request-maker";

export const checkError = (atual: ResponseError, expected: ResponseError) => {
  if (atual.message && expected.message) {
    expect(atual.message).to.be.equal(expected.message);
  }

  expect(atual).to.deep.equal({
    name: expected.name,
    code: expected.code,
  });
};

export const checkBalance = (
  atual: CreateCustomerTransactionResponseDTO,
  expected: BalanceEntity
) => {
  expect(atual).to.deep.equal({
    saldo: expected.amount,
    limite: expected.limit,
  });
};

import { expect } from "chai";
import {
  BalanceEntity,
  CustomerBalanceWithTransactionsEntity,
} from "@api/entity";
import { GetCustomerExtractResponseDTO } from "@api/controller/get-customer-extract.dto";
import { CreateCustomerTransactionResponseDTO } from "@api/controller/create-customer-transaction.dto";
import { ResponseError } from "./request-maker";
import { mapToCustomerBalanceTransactions } from "@app/api/service/customer-balance-transactions.mapper";

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

export const checkCustomerExtract = (
  atual: GetCustomerExtractResponseDTO,
  expected: CustomerBalanceWithTransactionsEntity[]
) => {
  const customerTransactions = mapToCustomerBalanceTransactions(expected);

  expect(atual).to.deep.equal({
    saldo: {
      total: customerTransactions.amount,
      limite: customerTransactions.limit,
      data_extrato: atual.saldo.data_extrato,
    },
    ultimas_transacoes: customerTransactions.transactions.map(
      (transaction) => ({
        tipo: transaction.type,
        valor: transaction.amount,
        descricao: transaction.description,
        realizada_em: new Date(transaction.createdAt).toISOString(),
      })
    ),
  });
};

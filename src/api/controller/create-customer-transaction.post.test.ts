import { expect } from "chai";
import { NotFoundError } from "routing-controllers";
import Container from "typedi";
import {
  RequestMaker,
  ResponseError,
  TestDatabaseManager,
  checkBalance,
  checkError,
  isDefined,
} from "@test";
import { DatabaseManager } from "@core/db";
import { BalanceEntity } from "@api/entity";
import { StatusCode, UnprocessableError } from "@app/core/error";
import {
  CreateCustomerTransactionResponseDTO,
  CreateCustomerTransactionBodyDTO,
} from "./create-customer-transaction.dto";

const getCustomerBalanceSQL = DatabaseManager.loadQuery(
  "find-customer-balance.query.sql",
  "repository"
);

describe("REST - CustomerTransactionController - createCustomerTransaction(POST)", () => {
  const requestMaker = new RequestMaker<
    CreateCustomerTransactionResponseDTO,
    CreateCustomerTransactionBodyDTO
  >("/customers");
  const testDbManager: TestDatabaseManager = Container.get(TestDatabaseManager);

  beforeEach(async () => {
    await testDbManager.resetDatabase();
  });

  it("should throw an error if customer does not exist", async () => {
    const customerId = 6;

    const response = await requestMaker.request<ResponseError>({
      url: `/${customerId}/transactions`,
      method: "POST",
      body: {
        valor: 1000,
        tipo: "c",
        descricao: "descricao",
      },
    });

    isDefined(response);
    checkError(response, {
      name: NotFoundError.name,
      code: StatusCode.NotFound,
    });
  });

  it("should return error in invalid debit transaction", async () => {
    const customerId = 1;
    const input = {
      valor: 100001,
      tipo: "d",
      descricao: "descricao",
    };

    const response = await requestMaker.request<ResponseError>({
      url: `/${customerId}/transactions`,
      method: "POST",
      body: input,
    });

    isDefined(response);
    checkError(response, {
      name: UnprocessableError.name,
      code: StatusCode.Unprocessable,
    });
  });

  it("should return a valid debit transaction", async () => {
    const customerId = 1;
    const input = {
      valor: 1000,
      tipo: "c",
      descricao: "descricao",
    };

    const response = await requestMaker.request({
      url: `/${customerId}/transactions`,
      method: "POST",
      body: input,
    });

    const atualBalance = await testDbManager.query<BalanceEntity>(
      getCustomerBalanceSQL,
      [customerId, input.tipo, input.valor]
    );

    isDefined(atualBalance);
    expect(customerId).to.be.equal(atualBalance?.customer_id);
    checkBalance(response, atualBalance);
  });

  it("should return a valid credit transaction", async () => {
    const customerId = 1;
    const input = {
      valor: 1000,
      tipo: "c",
      descricao: "descricao",
    };

    const response = await requestMaker.request({
      url: `/${customerId}/transactions`,
      method: "POST",
      body: input,
    });

    const atualBalance = await testDbManager.query<BalanceEntity>(
      getCustomerBalanceSQL,
      [customerId, input.tipo, input.valor]
    );

    isDefined(atualBalance);
    expect(customerId).to.be.equal(atualBalance?.customer_id);
    checkBalance(response, atualBalance);
  });
});

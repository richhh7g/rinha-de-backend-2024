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
import { StatusCode } from "@app/core/error";
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

  before(async () => {
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

  it("should return a valid credit transaction", async () => {
    const customerId = 1;

    const response = await requestMaker.request({
      url: `/${customerId}/transactions`,
      method: "POST",
      body: {
        valor: 1000,
        tipo: "c",
        descricao: "descricao",
      },
    });

    const atualBalance = await testDbManager.query<BalanceEntity>(
      getCustomerBalanceSQL,
      [customerId]
    );

    isDefined(atualBalance);
    expect(customerId).to.be.equal(atualBalance?.customer_id);
    checkBalance(response, atualBalance);
  });

  it("should return a valid debit transaction", async () => {
    const customerId = 1;

    const response = await requestMaker.request({
      url: `/${customerId}/transactions`,
      method: "POST",
      body: {
        valor: 1000,
        tipo: "d",
        descricao: "descricao",
      },
    });

    const atualBalance = await testDbManager.query<BalanceEntity>(
      getCustomerBalanceSQL,
      [customerId]
    );

    isDefined(atualBalance);
    expect(customerId).to.be.equal(atualBalance?.customer_id);
    checkBalance(response, atualBalance);
  });
});

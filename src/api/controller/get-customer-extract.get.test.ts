import { expect } from "chai";
import Container from "typedi";
import { NotFoundError } from "routing-controllers";
import {
  isDefined,
  checkError,
  RequestMaker,
  ResponseError,
  TestDatabaseManager,
  checkCustomerExtract,
  createTransaction,
} from "@test";
import { DatabaseManager } from "@core/db";
import { StatusCode } from "@app/core/error";
import { CustomerBalanceWithTransactionsEntity } from "@api/entity";
import { GetCustomerExtractResponseDTO } from "./get-customer-extract.dto";

const createTransactionQuery = DatabaseManager.loadQuery(
  "create-transaction.query.sql",
  "repository"
);

const balanceWithTransactionsQuery = DatabaseManager.loadQuery(
  "find-customer-balance-with-transactions.query.sql",
  "repository"
);

describe("REST - CustomerTransactionController - getCustomerExtract(GET)", () => {
  const requestMaker = new RequestMaker<GetCustomerExtractResponseDTO>(
    "/customers"
  );
  const testDbManager: TestDatabaseManager = Container.get(TestDatabaseManager);

  afterEach(async () => {
    await testDbManager.resetDatabase();
  });

  it("should throw an error if customer does not exist", async () => {
    const customerId = 6;

    const response = await requestMaker.request<ResponseError>({
      url: `/${customerId}/extract`,
      method: "GET",
    });

    isDefined(response);
    checkError(response, {
      name: NotFoundError.name,
      code: StatusCode.NotFound,
    });
  });

  it("should return a valid customer extract", async () => {
    const customerId = 1;

    const transactionsPromise = Array.from({ length: 10 }, () => {
      const transaction = createTransaction({ customer_id: customerId });

      const timeoutPromise = new Promise((resolve) => {
        setTimeout(() => {
          resolve({ timeout: true });
        }, 100);
      });

      const transactionPromise = testDbManager.execute(createTransactionQuery, [
        transaction.customer_id,
        transaction.type,
        transaction.amount,
        transaction.description,
        transaction.created_at,
      ]);

      return Promise.race([transactionPromise, timeoutPromise]);
    });

    await Promise.all(transactionsPromise);

    const response = await requestMaker.request({
      url: `/${customerId}/extract`,
      method: "GET",
    });

    const balanceWithTransactions = await testDbManager.query<
      CustomerBalanceWithTransactionsEntity[]
    >(balanceWithTransactionsQuery, [customerId]);

    isDefined(balanceWithTransactions);
    const customerIdDB = balanceWithTransactions.find(Boolean)!.customer_id;

    expect(customerId).to.be.equal(customerIdDB);
    checkCustomerExtract(response, balanceWithTransactions);
  });
});

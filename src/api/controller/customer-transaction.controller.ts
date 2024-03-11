import { Body, Get, JsonController, Param, Post } from "routing-controllers";
import { Service } from "typedi";
import { TransactionTypeShort } from "@api/model";
import {
  CreateCustomerTransactionService,
  GetCustomerExtractService,
} from "@api/service";
import { WorkerPool } from "@core/worker";
import {
  CreateCustomerTransactionBodyDTO,
  CreateCustomerTransactionResponseDTO,
} from "./create-customer-transaction.dto";
import { GetCustomerExtractResponseDTO } from "./get-customer-extract.dto";

@Service()
@JsonController("/customers/:id")
@JsonController("/clientes/:id")
export class CustomerTransactionController {
  constructor(
    private readonly getCustomerExtractService: GetCustomerExtractService,
    private readonly createCustomerTransactionService: CreateCustomerTransactionService,
    private readonly workerPool: WorkerPool
  ) {}

  @Post("/transacoes")
  @Post("/transactions")
  async createCustomerTransaction(
    @Param("id") customerId: number,
    @Body() body: CreateCustomerTransactionBodyDTO
  ): Promise<CreateCustomerTransactionResponseDTO> {
    const { limit, balance } = await this.createCustomerTransactionService.exec(
      {
        customerId,
        type: TransactionTypeShort[body.tipo.toUpperCase()],
        amount: body.valor,
        description: body.descricao,
      }
    );

    return {
      saldo: balance,
      limite: limit,
    };
  }

  @Get("/extrato")
  @Get("/extract")
  async getCustomerExtract(
    @Param("id") customerId: number
  ): Promise<GetCustomerExtractResponseDTO> {
    const customerExtract = await this.getCustomerExtractService.exec(
      customerId
    );

    return {
      saldo: {
        total: customerExtract.amount,
        limite: customerExtract.limit,
        data_extrato: customerExtract.executionDate,
      },
      ultimas_transacoes: customerExtract.transactions.map((transaction) => ({
        tipo: transaction.type,
        valor: transaction.amount,
        descricao: transaction.description,
        realizada_em: new Date(transaction.createdAt).toISOString(),
      })),
    };
  }
}

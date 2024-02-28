import { Body, JsonController, Param, Post } from "routing-controllers";
import { Service } from "typedi";
import { TransactionTypeShort } from "@api/model";
import { CreateCustomerTransactionService } from "@api/service";
import {
  CreateCustomerTransactionBodyDTO,
  CreateCustomerTransactionResponseDTO,
} from "./create-customer-transaction.dto";

@Service()
@JsonController("/customers/:id")
@JsonController("/clientes/:id")
export class CustomerTransactionController {
  constructor(
    private readonly createCustomerTransactionService: CreateCustomerTransactionService
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
}

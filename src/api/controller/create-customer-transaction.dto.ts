import { IsNumber, IsPositive, IsString, IsIn, Length } from "class-validator";
import { Service } from "typedi";
import { TransactionTypeShort } from "@api/model";

@Service()
export class CreateCustomerTransactionBodyDTO {
  @IsNumber()
  @IsPositive()
  readonly valor: number;

  @IsIn(Object.keys(TransactionTypeShort).map((type) => type.toLowerCase()))
  @Length(1, 1)
  @IsString()
  readonly tipo: string;

  @Length(1, 10)
  @IsString()
  readonly descricao: string;
}

@Service()
export class CreateCustomerTransactionResponseDTO {
  readonly saldo: number;
  readonly limite: number;
}

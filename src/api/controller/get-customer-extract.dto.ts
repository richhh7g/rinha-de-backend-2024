import { Service } from "typedi";

class BalanceDTO {
  total: number;
  limite: number;
  data_extrato: string;
}

class TransactionDTO {
  valor: number;
  tipo: string;
  descricao: string;
  realizada_em: string;
}

@Service()
export class GetCustomerExtractResponseDTO {
  saldo: BalanceDTO;
  ultimas_transacoes: TransactionDTO[];
}

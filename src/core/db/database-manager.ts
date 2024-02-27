import * as sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { readFileSync } from "fs";
import { DataSourceError } from "@core/error";
import { Service } from "typedi";

type LoadQueryParams = {
  isRepositoryPath: boolean;
};

@Service()
export class DatabaseManager {
  private db: Database | null = null;

  constructor() {}

  static loadQuery(filePath: string, params?: LoadQueryParams): string {
    try {
      const paths = {
        repository: "src/api/repository/sql/" + filePath,
      };

      return readFileSync(
        params?.isRepositoryPath ? paths.repository : filePath,
        "utf-8"
      );
    } catch (err) {
      throw new DataSourceError("Erro ao carregar consulta SQL do arquivo.");
    }
  }

  async connect(databasePath: string): Promise<void> {
    this.db = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    const isInitialized = await this.checkInitialization();
    if (!isInitialized) {
      const initSql = DatabaseManager.loadQuery(".docker/asset/init.sql");
      await this.db.exec(initSql);
    }
  }

  private async checkInitialization(): Promise<boolean> {
    try {
      const query = DatabaseManager.loadQuery(
        "src/core/db/sql/check-initialization.query.sql"
      );

      const result = await this.db?.get<{ name: string }>(query);

      return result?.name === "customers";
    } catch (err) {
      throw new DataSourceError(
        "Erro ao verificar a inicialização do banco de dados."
      );
    }
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T | null> {
    if (!this.db) {
      throw new DataSourceError("Database is not connected.");
    }

    const results = await this.db.all(sql, params);

    if (Array.isArray(results) && results.length > 1) {
      return results as T;
    }

    const result = results.find((result) => !!result);

    return result ? (result as T) : null;
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    if (!this.db) {
      throw new DataSourceError("Database is not connected.");
    }

    await this.db.run(sql, params);
  }
}

import { readFileSync } from "fs";
import { Service } from "typedi";
import path from "path";
import { Pool, PoolClient } from "pg";
import { DataSourceError } from "@core/error";
import { LoggerService } from "@core/log";
import { API_PATH, BASE_PATH, CORE_PATH } from "@core/util";

type SourceType = "main" | "core" | "repository";

@Service()
export class DatabaseManager {
  private pool: Pool;

  constructor(private readonly logger: LoggerService) {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: false,
    });
  }

  static loadQuery(filePath: string, source: SourceType): string {
    try {
      const sqlPaths = {
        main: path.resolve(BASE_PATH, filePath),
        core: path.resolve(CORE_PATH, "db", "sql", filePath),
        repository: path.resolve(API_PATH, "repository", "sql", filePath),
      };

      return readFileSync(sqlPaths[source ?? "main"], "utf-8");
    } catch (err) {
      throw new DataSourceError("Erro ao carregar consulta SQL do arquivo.");
    }
  }

  private async checkInitialization(): Promise<boolean> {
    try {
      const query = DatabaseManager.loadQuery(
        "check-initialization.query.sql",
        "core"
      );

      const result = await this.query<{ table_name: string }>(query);

      return result?.table_name === "customers";
    } catch (err) {
      throw new DataSourceError(
        "Erro ao verificar a inicialização do banco de dados."
      );
    }
  }

  async query<T = any>(queryText: string, params?: any[]): Promise<T | null> {
    const client: PoolClient = await this.pool.connect();
    try {
      const result = await client.query(queryText, params);

      if (result.rows && result.rows.length > 0) {
        return result.rows.length === 1
          ? (result.rows[0] as T)
          : (result.rows as T);
      }

      return null;
    } catch (err) {
      throw new Error();
    } finally {
      client.release();
    }
  }

  async queryTransaction(
    queries: { query: string; params?: any[] }[]
  ): Promise<void> {
    const client: PoolClient = await this.pool.connect();

    try {
      await client.query("BEGIN");

      for (const { query, params } of queries) {
        await client.query(query, params);
      }

      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
    } finally {
      client.release();
    }
  }

  async execute(queryText: string, params?: any[]): Promise<void> {
    const client: PoolClient = await this.pool.connect();
    try {
      await client.query(queryText, params);
    } finally {
      client.release();
    }
  }

  async connect(): Promise<PoolClient> {
    const connection = await this.pool.connect();

    const isInitialized = await this.checkInitialization();
    if (!isInitialized) {
      const initSql = DatabaseManager.loadQuery(
        "initialize-database.query.sql",
        "core"
      );
      this.execute(initSql);
    }

    return connection;
  }

  disconnect() {
    return this.pool.end();
  }
}

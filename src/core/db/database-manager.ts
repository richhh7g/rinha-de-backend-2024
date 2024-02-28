import * as sqlite3 from "sqlite3";
import { readFileSync } from "fs";
import { Service } from "typedi";
import path from "path";
import { DataSourceError } from "@core/error";
import { API_PATH, BASE_PATH, CORE_PATH } from "@core/util";

type SourceType = "main" | "core" | "repository";

@Service()
export class DatabaseManager {
  public db: sqlite3.Database | null = null;

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

  async connect(databasePath: string): Promise<void> {
    this.db = sqlite3.cached.Database(
      databasePath,
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE | sqlite3.OPEN_SHAREDCACHE
    );

    this.db.configure("busyTimeout", 5);

    this.db.on("open", () => {
      console.log("Banco de dados SQLite aberto com sucesso.");
    });

    this.db.on("error", (err) => {
      console.error("Erro no banco de dados SQLite:", err.message);
    });

    const isInitialized = await this.checkInitialization();
    if (!isInitialized) {
      const initSql = DatabaseManager.loadQuery(
        "initialize-database.query.sql",
        "core"
      );
      this.db.exec(initSql);
    }
  }

  private async checkInitialization(): Promise<boolean> {
    try {
      const query = DatabaseManager.loadQuery(
        "check-initialization.query.sql",
        "core"
      );

      return new Promise<boolean>((resolve, reject) => {
        if (!this.db) {
          reject(new DataSourceError("Database is not connected."));
          return;
        }

        this.db.get<{ name: string }>(query, (err, row) => {
          if (err) {
            reject(err);
            return;
          }

          const result = row?.name === "customers";
          resolve(result);
        });
      });
    } catch (err) {
      throw new DataSourceError(
        "Erro ao verificar a inicialização do banco de dados."
      );
    }
  }

  async disconnect(): Promise<void> {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error("Erro ao fechar o banco de dados SQLite:", err.message);
          return;
        }

        console.log("Banco de dados SQLite fechado com sucesso.");
      });

      this.db = null;
    }
  }

  async query<T = any>(sql: string, params?: any[]): Promise<T | null> {
    if (!this.db) {
      throw new DataSourceError("Database is not connected.");
    }

    return new Promise<T | null>((resolve, reject) => {
      this.db?.all<T>(sql, params, (err, rows) => {
        if (err) {
          reject(err);
          return;
        }

        if (rows && rows.length > 0) {
          resolve(rows.length === 1 ? (rows[0] as T) : (rows as T));
        } else {
          resolve(null);
        }
      });
    });
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.db) {
        reject(new DataSourceError("Database is not connected."));
        return;
      }

      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

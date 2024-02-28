import { Service } from "typedi";
import { DatabaseManager } from "@app/core/db";

@Service()
export class TestDatabaseManager {
  constructor(private readonly dbManager: DatabaseManager) {}

  async resetDatabase(): Promise<void> {
    const resetQuery = DatabaseManager.loadQuery(
      "reset-database.query.sql",
      "core"
    );
    const initializeDatabaseQuery = DatabaseManager.loadQuery(
      "initialize-database.query.sql",
      "core"
    );

    await this.dbManager.execute(resetQuery);
    await this.dbManager.execute(initializeDatabaseQuery);
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    return this.dbManager.execute(sql, params);
  }

  async query<T>(sql: string, params?: any[]): Promise<T | null> {
    return this.dbManager.query<T>(sql, params);
  }
}

import { Service } from "typedi";
import { DatabaseManager } from "@app/core/db";

@Service()
export class TestDatabaseManager {
  constructor(private readonly dbManager: DatabaseManager) {}

  async resetDatabase(): Promise<void> {
    const resetQuery = DatabaseManager.loadQuery(
      "reset-transactions-table.query.sql",
      "core"
    );

    await this.dbManager.execute(resetQuery);
  }

  async execute(sql: string, params?: any[]): Promise<void> {
    return this.dbManager.execute(sql, params);
  }

  async query<T>(sql: string, params?: any[]): Promise<T | null> {
    return this.dbManager.query<T>(sql, params);
  }
}

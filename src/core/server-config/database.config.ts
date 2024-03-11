import { ConfigureType } from "node-runner-ts";
import Container, { Service } from "typedi";
import { DatabaseManager } from "@core/db";

@Service()
export class DatabaseConfig implements ConfigureType {
  async configure() {
    const db = Container.get(DatabaseManager);

    await db.connect();
  }
}

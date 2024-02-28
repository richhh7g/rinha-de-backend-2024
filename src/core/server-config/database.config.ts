import { ConfigureType } from "node-runner-ts";
import Container, { Service } from "typedi";
import { DatabaseManager } from "@core/db";
import { IS_SERVER } from "@core/util";

@Service()
export class DatabaseConfig implements ConfigureType {
  async configure() {
    const db = Container.get(DatabaseManager);

    const commonPath = ".docker/asset/";
    await db.connect(
      IS_SERVER ? commonPath + "database.db" : commonPath + "test-database.db"
    );
  }
}

import { ConfigureType } from "node-runner-ts";
import Container, { Service } from "typedi";
import { DatabaseManager } from "@core/db";
import { BASE_PATH, IS_SERVER } from "@core/util";

@Service()
export class DatabaseConfig implements ConfigureType {
  async configure() {
    const db = Container.get(DatabaseManager);

    const commonPath = ".docker/asset/";
    await db.connect(
      IS_SERVER
        ? commonPath + "database.db"
        : BASE_PATH + "/test/test-database.db"
    );
  }
}

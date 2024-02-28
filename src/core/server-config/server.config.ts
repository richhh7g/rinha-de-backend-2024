import { ConfigureType } from "node-runner-ts";
import Container, { Service } from "typedi";
import { ExpressConfig, DatabaseConfig } from "@core/server-config";
import { ServerIOC } from "@core/ioc";

@Service()
export class ServerConfig implements ConfigureType {
  constructor() {}

  async configure() {
    const serverIOC = Container.get(ServerIOC);
    serverIOC.register();

    const dbConfig = Container.get(DatabaseConfig);
    await dbConfig.configure();

    const expressConfig = Container.get(ExpressConfig);
    const server = await expressConfig.configure();

    return server;
  }
}

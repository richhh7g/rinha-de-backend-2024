import { ConfigureType } from "node-runner-ts";
import Container, { Service } from "typedi";
import { ExpressConfig } from "@core/server-config";
import { ServerIOC } from "@core/ioc";

@Service()
export class ServerConfig implements ConfigureType {
  constructor() {}

  async configure() {
    const serverIOC = Container.get(ServerIOC);
    serverIOC.register();

    const expressConfig = Container.get(ExpressConfig);
    const server = await expressConfig.configure();

    return server;
  }
}

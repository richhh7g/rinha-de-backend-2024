import e from "express";
import { RunnerType } from "node-runner-ts";
import { getServers } from "node:dns";
import Container, { Service } from "typedi";
import { ServerConfig } from "@core/server-config";

@Service()
export default class ServerRunner implements RunnerType {
  private server: e.Express;

  constructor() {}

  async configure() {
    const serverConfig = Container.get(ServerConfig);
    const server = await serverConfig.configure();

    this.server = server;
  }

  async run() {
    const PORT = process.env.APP_PORT;

    const server = this.server.listen(PORT, () => {
      console.log(`Server is running on port http://${getServers()}:${PORT}`);
    });

    process.on("SIGINT", () => {
      server.close(() => {
        console.log("Closed server");
      });
    });

    process.on("SIGQUIT", () => {
      server.close(() => {
        console.log("Closed server");
      });
    });
  }
}

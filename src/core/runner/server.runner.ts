import e from "express";
import { getServers } from "node:dns";
import { RunnerType } from "node-runner-ts";
import Container, { Service } from "typedi";
import { localization } from "@core/localization";
import { DatabaseManager } from "@core/db";
import { logger } from "@core/log";
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
      logger.info(
        localization.translate("success.server-runner.running", {
          host: getServers(),
          port: PORT,
        })
      );
    });

    const db = Container.get(DatabaseManager);

    process.on("SIGINT", () => {
      server.close(async () => {
        await db.disconnect();

        logger.error(localization.translate("error.server-runner.running"));
      });
    });

    process.on("SIGQUIT", () => {
      server.close(async () => {
        await db.disconnect();

        logger.error(localization.translate("error.server-runner.running"));
      });
    });
  }
}

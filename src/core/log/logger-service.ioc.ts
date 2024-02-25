import Container, { Service, Token } from "typedi";
import { createLogger, format, transports } from "winston";
import { DependencyRegister } from "@core/ioc";
import { LoggingDriver } from "./logger-service.type";

export const LOGGER_DRIVER_TOKEN = new Token<LoggingDriver>(
  "LOGGER_DRIVER_TOKEN"
);

@Service()
export class LoggerSeviceIOC implements DependencyRegister {
  constructor() {}

  async register() {
    const loggerDriver = createLogger({
      level: "info",
      format: format.combine(format.errors({ stack: true })),
      transports: [
        new transports.Console({
          format: format.combine(
            format.timestamp(),
            format.colorize(),
            format.simple()
          ),
        }),
      ],
    });

    Container.set<LoggingDriver>(LOGGER_DRIVER_TOKEN, loggerDriver);
  }
}

import { Inject, Service } from "typedi";
import { LOGGER_DRIVER_TOKEN } from "./logger-service.ioc";
import {
  LoggingDriver,
  Logger,
  LogParams,
  LogErrorParams,
} from "./logger-service.type";

@Service()
export class LoggerService implements Logger {
  constructor(
    @Inject(LOGGER_DRIVER_TOKEN)
    private readonly logger: LoggingDriver
  ) {}

  private log(
    level: string,
    payload: string | LogParams | LogErrorParams,
    ...additionalParams: any[]
  ): void {
    this.logger.log("info", "ilaaa");
    if (typeof payload === "string") {
      this.logger?.log({
        level,
        message: payload + additionalParams?.join(" "),
        ...context,
      });
    } else {
      const { error, ...additionalInfo } = payload;
      this.logger?.log({
        level,
        message: error || this.composeLogMessage(additionalInfo),
        ...additionalInfo,
        ...additionalParams,
        ...context,
      });
    }
  }

  private composeLogMessage(info: LogParams): string {
    let baseMessage = `[${info.layer}] [${info.className ?? "global"}.${
      info.method
    }]`;
    if (info.message) {
      baseMessage += info.message;
    }
    return baseMessage;
  }

  debug(params: LogParams): void;
  debug(params: string, ...additionalParams: string[]): void;
  debug(params: any, ...additionalParams: any[]): void {
    this.log("debug", params, ...additionalParams);
  }

  info(params: LogParams): void;
  info(params: string, ...additionalParams: string[]): void;
  info(params: any, ...additionalParams: any[]): void {
    this.log("info", params, ...additionalParams);
  }

  warn(params: LogParams): void;
  warn(params: LogErrorParams): void;
  warn(params: string, ...additionalParams: string[]): void;
  warn(params: any, ...additionalParams: any[]): void {
    this.log("warn", params, ...additionalParams);
  }

  error(params: LogErrorParams): void;
  error(params: string, ...additionalParams: string[]): void;
  error(params: any, ...additionalParams: any[]): void {
    this.log("error", params, ...additionalParams);
  }
}

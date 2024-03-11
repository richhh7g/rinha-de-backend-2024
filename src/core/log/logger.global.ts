import Container from "typedi";
import { Globalize } from "@core/util";
import { LoggerSeviceIOC } from "@core/ioc";
import { LoggerService } from "./logger.service";

export const logger = Globalize<LoggerService>([
  Container.get(LoggerSeviceIOC),
])(Container.get(LoggerService));

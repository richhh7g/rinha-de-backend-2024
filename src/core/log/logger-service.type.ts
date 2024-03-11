import { LogMethod } from "winston";

export enum ApplicationLayer {
  Core = "Core",
  Api = "Api",
}

export interface LoggingDriver {
  log: LogMethod;
}

export interface BaseLogParams {
  uuid?: string;
  className?: string;
  method?: string;
  layer: ApplicationLayer;
  [key: string]: any;
}

export interface LogErrorParams extends BaseLogParams {
  error: Error;
}

export interface LogParams extends BaseLogParams {
  message?: string;
}

export interface Logger {
  debug(params: LogParams): void;
  debug(params: string, ...additionalParams: string[]): void;
  debug(params: any, ...additionalParams: any[]): void;

  info(params: LogParams): void;
  info(params: string, ...additionalParams: string[]): void;
  info(params: any, ...additionalParams: any[]): void;

  warn(params: LogParams): void;
  warn(params: LogErrorParams): void;
  warn(params: string, ...additionalParams: string[]): void;
  warn(params: any, ...additionalParams: any[]): void;

  error(params: LogErrorParams): void;
  error(params: string, ...additionalParams: string[]): void;
  error(params: any, ...additionalParams: any[]): void;
}

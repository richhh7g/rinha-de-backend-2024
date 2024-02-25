import { DependencyRegister } from "@core/ioc";
import { ConfigureType, RunnerType } from "node-runner-ts";

export class TypeChecker {
  constructor() {}

  static isConfigureType(instance: any): instance is ConfigureType {
    return "configure" in instance;
  }

  static isRunnerType(instance: any): instance is RunnerType {
    return "configure" in instance && "run" in instance;
  }

  static isDependencyRegister(instance: any): instance is DependencyRegister {
    return "register" in instance;
  }
}

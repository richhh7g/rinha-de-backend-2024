import { ConfigureType, RunnerType } from "node-runner-ts";
import { DataSourceError } from "@core/error";
import { DependencyRegister } from "@core/ioc";
import { TypeChecker } from "./type-checker.util";

export const Globalize = <GlobalInstance>(
  dependencies?: (DependencyRegister | ConfigureType | RunnerType)[]
) => {
  if (Array.isArray(dependencies)) {
    for (const dependency of dependencies) {
      if (TypeChecker.isDependencyRegister(dependency)) {
        dependency.register();
      }

      if (
        TypeChecker.isConfigureType(dependency) &&
        !TypeChecker.isRunnerType(dependency)
      ) {
        dependency.configure().then();
      }

      if (TypeChecker.isRunnerType(dependency)) {
        dependency.configure().then();
        dependency.run().then();
      }
    }
  }

  return (wrappedService: GlobalInstance) => {
    if (!wrappedService) {
      throw new DataSourceError();
    }

    return wrappedService;
  };
};

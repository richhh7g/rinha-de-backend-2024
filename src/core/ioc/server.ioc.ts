import Container, { Service } from "typedi";
import { DependencyRegister } from "@core/ioc";
import { LoggerSeviceIOC } from "@core/log/logger-service.ioc";
import { TypeChecker } from "@core/util";

@Service()
export class ServerIOC implements DependencyRegister {
  register(): void {
    const subDependencies: DependencyRegister[] = [
      Container.get(LoggerSeviceIOC),
    ];

    for (const subDependency of subDependencies) {
      if (TypeChecker.isDependencyRegister(subDependency)) {
        subDependency.register();
      }
    }
  }
}

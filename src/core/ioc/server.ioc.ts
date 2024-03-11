import { useContainer } from "routing-controllers";
import Container, { Service } from "typedi";
import { DependencyRegister } from "@core/ioc";
import { LoggerSeviceIOC } from "@core/ioc";
import { TypeChecker } from "@core/util";

@Service()
export class ServerIOC implements DependencyRegister {
  async register(): Promise<void> {
    useContainer(Container);

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

import Container, { Service, Token } from "typedi";
import { InitOptions, createInstance } from "i18next";
import { DependencyRegister } from "@core/ioc";
import { LocalizationDriver } from "@core/localization";

export const LOCALIZATION_DRIVER_TOKEN = new Token<LocalizationDriver>(
  "LOCALIZATION_DRIVER_TOKEN"
);

@Service()
export class LocalizationIOC implements DependencyRegister<LocalizationDriver> {
  constructor() {}

  register(driverConfig?: InitOptions) {
    const localizationDriver = createInstance(driverConfig);

    Container.set<LocalizationDriver>(
      LOCALIZATION_DRIVER_TOKEN,
      localizationDriver
    );

    return localizationDriver;
  }
}

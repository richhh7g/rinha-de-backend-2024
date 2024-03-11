import { Inject, Service } from "typedi";
import { LOCALIZATION_DRIVER_TOKEN } from "@core/ioc";
import {
  TranslateKey,
  Localization,
  LocalizationDriver,
  TranslateMethodOptions,
} from "./localization.type";

@Service()
export class LocalizationService implements Localization {
  constructor(
    @Inject(LOCALIZATION_DRIVER_TOKEN)
    private readonly driver: LocalizationDriver
  ) {}

  translate(key: TranslateKey, options?: TranslateMethodOptions): string {
    return this.driver.t(key, options);
  }
}

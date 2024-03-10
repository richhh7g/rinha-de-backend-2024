import Container, { Service } from "typedi";
import { ConfigureType } from "node-runner-ts";
import { LocalizationIOC } from "@core/ioc";
import { Language, Namespace, NAMESPACES, RESOURCES } from "@core/localization";

@Service()
export class LocalizationConfig implements ConfigureType {
  async configure(): Promise<void> {
    const localizationIOC = Container.get(LocalizationIOC);

    const localization = localizationIOC.register({
      ns: NAMESPACES,
      lng: Language.Pt,
      defaultNS: Namespace.Api,
      fallbackNS: Namespace.Core,
      fallbackLng: Language.En,
      resources: this.getResource(Language.Pt),
      compatibilityJSON: "v4",
    });

    localization.init();
  }

  private getResource(key: Language): Record<string, Record<string, any>> {
    return { [key]: RESOURCES[key] };
  }
}

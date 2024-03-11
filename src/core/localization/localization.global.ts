import Container from "typedi";
import { Globalize } from "@core/util";
import { LocalizationConfig } from "@core/server-config";
import { LocalizationService } from "./localization.service";

export const localization = Globalize<LocalizationService>([
  Container.get(LocalizationConfig),
])(Container.get(LocalizationService));

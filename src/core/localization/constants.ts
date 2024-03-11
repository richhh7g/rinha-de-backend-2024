import { Language, Namespace } from "./localization.type";

import ptAPI from "@api/locale/pt.json";
import ptCore from "@core/localization/locale/pt/core.json";

import enAPI from "@api/locale/en.json";
import enCore from "@core/localization/locale/en/core.json";

export const RESOURCES = {
  [Language.En]: {
    [Namespace.Api]: enAPI,
    [Namespace.Core]: enCore,
  },
  [Language.Pt]: {
    [Namespace.Api]: ptAPI,
    [Namespace.Core]: ptCore,
  },
};

export const NAMESPACES: Namespace[] = [Namespace.Api, Namespace.Core];

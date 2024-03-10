import { TOptionsBase, i18n } from "i18next";
import { $Dictionary } from "i18next/typescript/helpers";

export enum Language {
  En = "en",
  Pt = "pt",
}

export enum Namespace {
  Api = "Api",
  Core = "Core",
}

export type TranslateKey =
  | string
  | TemplateStringsArray
  | (string | TemplateStringsArray)[];

export type TranslateMethodOptions = (TOptionsBase & $Dictionary) | undefined;

export interface Localization {
  translate(key: TranslateKey, options: TranslateMethodOptions): string;
}

export interface LocalizationDriver extends i18n {}

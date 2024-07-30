import i18next from "i18next";
import I18NextHttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { en, pt } from "./";

const resources = { en, pt };

type KeyOf<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}.${KeyOf<T[K]>}`
    : `${K}`;
}[keyof T & (string | number)];

type TTranslations = typeof en.translations;

type StringMap = {
  [key: string]: any;
};
let lng = "en";
const i18nInstance = i18next.createInstance();

t: (key: KeyOf<TTranslations>, Interpolation?: StringMap) =>
  i18nInstance.t<string, string>(key);

i18nInstance
  .use(I18NextHttpBackend)
  .use(initReactI18next)
  .init({
    lng,
    resources,
    preload: ["pt", "en"],
    fallbackLng: "en",
    defaultNS: "translations",
  });

type ExtendedI18nInstance = typeof i18nInstance & {
  t: (key: KeyOf<TTranslations>, Interpolation?: StringMap) => string;
};
export const i18n = i18nInstance as ExtendedI18nInstance;

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import cs from "../i18n/locales/cs";
import vi from "../i18n/locales/vi"

i18n.translations = {
  cs: cs,
  vi: vi
};

i18n.fallbacks = true;
i18n.defaultLocale = "cs";
i18n.locale = Localization.locale;

export default i18n;
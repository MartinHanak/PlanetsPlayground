import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import HOME_EN from './data/translations/en/home.json';
import HOME_CS from './data/translations/cs/home.json';

import NAVBAR_EN from './data/translations/en/navbar.json';
import NAVBAR_CS from './data/translations/cs/navbar.json';


// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    home: HOME_EN,
    navbar: NAVBAR_EN,
    test: {test: "testing"}
  },
  cs: {
    home: HOME_CS,
    navbar: NAVBAR_CS, 
    test: {test: "český test"}
  }
};



i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    debug:true,
    resources,
    fallbackLng: 'en', 
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;
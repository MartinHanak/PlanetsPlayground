import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';

import HOME_EN from './data/translations/en/home.json';
import HOME_CS from './data/translations/cs/home.json';

import NAVBAR_EN from './data/translations/en/navbar.json';
import NAVBAR_CS from './data/translations/cs/navbar.json';

import FOOTER_EN from './data/translations/en/footer.json';
import FOOTER_CS from './data/translations/cs/footer.json';

import CONTACT_EN from './data/translations/en/contact.json';
import CONTACT_CS from './data/translations/cs/contact.json';

import NODATA_EN from './data/translations/en/nodata.json';
import NODATA_CS from './data/translations/cs/nodata.json';

import ABOUT_EN from './data/translations/en/about.json';
import ABOUT_CS from './data/translations/cs/about.json';

import LOADING_EN from './data/translations/en/loading.json';
import LOADING_CS from './data/translations/cs/loading.json';

import IMPORT_EN from './data/translations/en/import.json';
import IMPORT_CS from './data/translations/cs/import.json';

import SIMULATION_EN from './data/translations/en/simulation.json';
import SIMULATION_CS from './data/translations/cs/simulation.json';


// the translations
const resources = {
  en: {
    home: HOME_EN,
    navbar: NAVBAR_EN,
    footer: FOOTER_EN,
    contact: CONTACT_EN,
    nodata: NODATA_EN,
    about: ABOUT_EN,
    loading: LOADING_EN,
    import: IMPORT_EN,
    simulation: SIMULATION_EN,
    test: {test: "testing"}
  },
  cs: {
    home: HOME_CS,
    navbar: NAVBAR_CS, 
    footer: FOOTER_CS,
    contact: CONTACT_CS,
    nodata: NODATA_CS,
    about: ABOUT_CS,
    loading: LOADING_CS,
    import: IMPORT_CS,
    simulation: SIMULATION_CS,
    test: {test: "český test"}
  }
};


i18n
  .use(LanguageDetector)
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
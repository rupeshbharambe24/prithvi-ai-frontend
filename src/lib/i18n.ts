import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      'nav.overview': 'Overview',
      'nav.heat': 'Heat Risk',
      'nav.disease': 'Disease Risk',
      'nav.hospital': 'Hospital Surge',
      'nav.air': 'Air Quality',
      'nav.scenario': 'Scenario Planner',
      'nav.optimizer': 'Resource Optimizer',
      'nav.alerts': 'Alerts',
      'nav.kg': 'Knowledge Graph',
      'nav.evidence': 'Evidence',
      'nav.catalog': 'Data Catalog',
      'nav.fairness': 'Fairness & QA',
      'nav.field': 'Field',
      'nav.admin': 'Admin',
      'nav.settings': 'Settings',

      // Landing
      'landing.hero.title': 'Intelligence for the Planet.',
      'landing.hero.subtitle': 'Insight for Humanity.',
      'landing.hero.description': 'Climate-informed health intelligence platform for proactive decision-making',
      'landing.cta.demo': 'Try Demo',
      'landing.cta.login': 'Log In',

      // Auth
      'auth.login': 'Log In',
      'auth.signup': 'Sign Up',
      'auth.email': 'Email',
      'auth.password': 'Password',
      'auth.remember': 'Remember me',
      'auth.forgot': 'Forgot password?',
      'auth.no_account': 'Don\'t have an account?',
      'auth.has_account': 'Already have an account?',

      // Common
      'common.loading': 'Loading...',
      'common.error': 'Error',
      'common.success': 'Success',
      'common.save': 'Save',
      'common.cancel': 'Cancel',
      'common.delete': 'Delete',
      'common.edit': 'Edit',
      'common.search': 'Search',
      'common.export': 'Export',
      'common.download': 'Download',
    },
  },
  hi: {
    translation: {
      // Navigation
      'nav.overview': 'अवलोकन',
      'nav.heat': 'ताप जोखिम',
      'nav.disease': 'रोग जोखिम',
      'nav.hospital': 'अस्पताल भार',
      'nav.air': 'वायु गुणवत्ता',
      'nav.scenario': 'परिदृश्य योजनाकार',
      'nav.optimizer': 'संसाधन अनुकूलक',
      'nav.alerts': 'अलर्ट',
      'nav.kg': 'ज्ञान ग्राफ',
      'nav.evidence': 'साक्ष्य',
      'nav.catalog': 'डेटा सूची',
      'nav.fairness': 'निष्पक्षता और QA',
      'nav.field': 'फील्ड',
      'nav.admin': 'व्यवस्थापक',
      'nav.settings': 'सेटिंग्स',

      // Landing
      'landing.hero.title': 'ग्रह के लिए बुद्धि।',
      'landing.hero.subtitle': 'मानवता के लिए अंतर्दृष्टि।',
      'landing.hero.description': 'सक्रिय निर्णय लेने के लिए जलवायु-सूचित स्वास्थ्य खुफिया मंच',
      'landing.cta.demo': 'डेमो आज़माएं',
      'landing.cta.login': 'लॉग इन',

      // Auth
      'auth.login': 'लॉग इन',
      'auth.signup': 'साइन अप',
      'auth.email': 'ईमेल',
      'auth.password': 'पासवर्ड',
      'auth.remember': 'मुझे याद रखें',
      'auth.forgot': 'पासवर्ड भूल गए?',
      'auth.no_account': 'खाता नहीं है?',
      'auth.has_account': 'पहले से खाता है?',

      // Common
      'common.loading': 'लोड हो रहा है...',
      'common.error': 'त्रुटि',
      'common.success': 'सफलता',
      'common.save': 'सहेजें',
      'common.cancel': 'रद्द करें',
      'common.delete': 'हटाएं',
      'common.edit': 'संपादित करें',
      'common.search': 'खोजें',
      'common.export': 'निर्यात',
      'common.download': 'डाउनलोड',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;

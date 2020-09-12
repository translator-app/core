import * as React from 'react';
import { translator, RawTranslationLibrary, RawTranslationRegistry } from '@translator/core';

type ProviderProps = {
  children: React.ReactNode;
  language: string;
  fallbackLanguage: string;
  library: RawTranslationLibrary;
  getTranslationRegistry: (language: string) => RawTranslationRegistry;
};

type ProviderValue = {
  language: string;
  registryVersion: number;
  getTranslation: (key: string, data?: any) => string;
};

const TranslatorContext = React.createContext({} as ProviderValue);

function versionReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { version: state.version + 1 };
    default:
      return state;
  }
}

export function LanguageProvider(props: ProviderProps) {
  let { children, library, language, fallbackLanguage, getTranslationRegistry } = props;
  let [translatorInstance] = React.useState(() => {
    return translator({
      fallbackLanguage,
      library,
    });
  });
  let [registryVersion, dispatchVersionChange] = React.useReducer(versionReducer, { version: 0 });

  React.useEffect(() => {
    if (!translatorInstance.hasLanguage(language)) {
      const fetchTranslations = async () => {
        let translationRegistry = await getTranslationRegistry(language);
        translatorInstance.addLanguage(language, translationRegistry);
        dispatchVersionChange({ type: 'increment' });
      };

      fetchTranslations();
    }
  }, [language]);

  const getTranslation = (key: string, values: any) => {
    let translation = translatorInstance.translate({ key, values, language });
    return translation.value;
  };

  let providerValues = {
    language,
    getTranslation,
    registryVersion: registryVersion.version,
  };

  return <TranslatorContext.Provider value={providerValues}>{children}</TranslatorContext.Provider>;
}

export const useLanguage = React.useContext(TranslatorContext);
export const Consumer = TranslatorContext.Consumer;

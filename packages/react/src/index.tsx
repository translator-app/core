import * as React from 'react';
import { translator, RawTranslationLibrary, RawTranslationRegistry } from '@translator/core';

type ProviderProps = {
  children: React.ReactNode;
  language: string;
  fallbackLanguage?: string;
  library?: RawTranslationLibrary;
  getTranslationRegistry?: (language: string) => Promise<RawTranslationRegistry> | RawTranslationRegistry;
};

type ProviderValue = {
  language: string;
  version: number;
  translate: (key: string, data?: any) => string;
};

const TranslatorContext = React.createContext<ProviderValue>({} as ProviderValue);

function versionReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { version: state.version + 1 };
    default:
      return state;
  }
}

export function TranslatorProvider(props: ProviderProps) {
  let { children, library, language, fallbackLanguage, getTranslationRegistry } = props;
  let [translatorInstance] = React.useState(() => {
    return translator({
      fallbackLanguage: fallbackLanguage || language,
      library,
    });
  });
  let [registryVersion, dispatchVersionChange] = React.useReducer(versionReducer, { version: 0 });

  React.useEffect(() => {
    if (!translatorInstance.hasLanguage(language)) {
      let result = getTranslationRegistry(language);
      const update = (newRegistry) => {
        translatorInstance.addLanguage(language, newRegistry);
        dispatchVersionChange({ type: 'increment' });
      };
      
      if (result instanceof Promise) {
        result.then(update);
      } else {
        update(result);
      }
    }
  }, [language]);

  const getTranslation = (key: string, values: any) => {
    let translation = translatorInstance.translate({ key, values, language });
    return translation.value;
  };

  let providerValues = {
    language,
    translate: getTranslation,
    version: registryVersion.version,
  };

  return <TranslatorContext.Provider value={providerValues}>{children}</TranslatorContext.Provider>;
}

export const useTranslator = () => React.useContext(TranslatorContext);
export const TranslatorConsumer = TranslatorContext.Consumer;

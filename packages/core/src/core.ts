import { format } from './format';
import { flattenObject } from './utils';

export type RawTranslationRegistry = { [key: string]: string | RawTranslationRegistry };
export type RawTranslationLibrary = { [key: string]: RawTranslationRegistry };

export type TranslationLibrary = { [key: string]: TranslationRegistry };
export type TranslationRegistry = { [key: string]: string };

export interface TranslatorOptions {
  fallbackLanguage: string;
  library?: { [key: string]: RawTranslationRegistry };
}

export interface TranslatorInstance {
  translate: ({
    key,
    values,
    language,
  }: {
    key: string;
    values?: any;
    language?: string;
  }) => {
    value: string;
    isTranslated: boolean;
  };
  addLanguage: (language: string, registry: RawTranslationRegistry) => void;
  hasLanguage: (language: string) => boolean;
}

export function translator(opts: TranslatorOptions): TranslatorInstance {
  let library: TranslationLibrary = {};
  let fallbackLanguage = opts.fallbackLanguage;

  const hasLanguage = (language: string) => {
    return !!library[language];
  };

  const addLanguage = (language: string, registry: RawTranslationRegistry) => {
    library[language] = flattenObject(registry);
  };

  const translate = ({ key, values = {}, language = fallbackLanguage }) => {
    let registry = library[language];
    let isTranslated = !!registry;
    if (!isTranslated) {
      registry = library[fallbackLanguage];
    }

    if (registry && typeof registry[key] === 'string') {
      return {
        value: format(registry[key], values),
        isTranslated,
      };
    }

    return {
      value: key,
      isTranslated: false,
    };
  };

  if (opts.library) {
    Object.keys(opts.library).forEach((key) => {
      addLanguage(key, opts.library[key]);
    });
  }

  return {
    translate,
    addLanguage,
    hasLanguage,
  };
}

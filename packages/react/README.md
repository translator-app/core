# @translator-app/react

The translator app react library, is a react context that creates a `@translator-app/core` instance and adds some utilities on top to make it easier to use with react. Such as asynchronously loading translation files and simplifying the overall API of core into provider properties and callback functions.

## Usage

To use this library you can import `TranslatorProvider`, `useTranslator` and/or `TranslatorConsumer`.

The Provider takes in the following properties:

```tsx
// React child nodes
children: React.ReactNode;
// The currently displayed language
language: string;
// A language to fallback to, if non is defined it will fallback to the key name
fallbackLanguage?: string;
// An object that contains a library of translations with the key being the language key and value an object of translation templates
library?: RawTranslationLibrary;
// A function that gets called if it exists and the defined language does not exist in the library. It should return the translation file for that language
getTranslationRegistry?: (language: string) => Promise<RawTranslationRegistry> | RawTranslationRegistry;
```

Provider values (the values you receive when using `useTranslator` and/or `TranslatorConsumer`):

```tsx
// The currently configured language, same as provided property...
language: string;
// A function to translate a key with an optional values field, values can be an object or array. Always returns a string.
translate: (key: string, values?: any) => string;
// The current version of the library, this is just a count of the amount of times getTranslationRegistry is called
version: number;
```

## Example

```tsx
import React from 'react';

const Example = () => {
  let { translate } = useTranslator();

  return <div>{translate('test', { name: 'Bob' })}</div>;
};

const App = () => {
  let { translationKey, values } = props;
  let { translate } = useTranslator();

  return (
    <TranslatorProvider
      language="nl"
      fallbackLanguage="en"
      library={{
        en: {
          test: 'This is a test value',
        },
      }}
      // This can also return a promise (or be an async function)
      getTranslationRegistry={(language) => {
        if (language !== 'nl') {
          throw new Error('This should not be requested...');
        }

        return {
          test: 'Dit is een test waarde',
        };
      }}
    >
      <Example translationKey="test" />
    </TranslatorProvider>
  );
};
```

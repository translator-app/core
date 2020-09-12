import React from 'react';
import 'regenerator-runtime';
import { render, screen, waitFor } from '@testing-library/react';
import { TranslatorProvider, useTranslator } from './index';

const TEST_ID = 'translated-value';

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

interface ExampleProps {
  translationKey: string;
  values?: any;
}

const Example = (props: ExampleProps) => {
  let { translationKey, values } = props;
  let { translate } = useTranslator();

  return <div data-testid={TEST_ID}>{translate(translationKey, values)}</div>;
};

test('Basic functionality test', () => {
  let result = render(
    <TranslatorProvider
      language="en"
      library={{
        en: {
          test: 'This is a test value',
        },
      }}
    >
      <Example translationKey="test" />
    </TranslatorProvider>
  );

  let value = result.queryByTestId(TEST_ID).innerHTML;
  expect(value).toEqual('This is a test value');
});

test('Should be able to fallback to fallbackLanguage', () => {
  let library = {
    en: {
      test: 'This is a test value',
      notTest: 'This is not a test value',
    },
    nl: {
      test: 'Dit is een test waarde',
    },
  };

  let result = render(
    <TranslatorProvider language="nl" fallbackLanguage="en" library={library}>
      <Example translationKey="notTest" />
    </TranslatorProvider>
  );

  let value = result.queryByTestId(TEST_ID).innerHTML;
  expect(value).toEqual('This is not a test value');
});

test('Should be able to use non-fallback language', () => {
  let library = {
    en: {
      test: 'This is a test value',
      notTest: 'This is not a test value',
    },
    nl: {
      test: 'Dit is een test waarde',
    },
  };

  let result = render(
    <TranslatorProvider language="nl" fallbackLanguage="en" library={library}>
      <Example translationKey="test" />
    </TranslatorProvider>
  );

  let value = result.queryByTestId(TEST_ID).innerHTML;
  expect(value).toEqual('Dit is een test waarde');
});

test('Should be able to asynchronously fetch a language', async () => {
  let library = {
    en: {
      test: 'This is a test value',
    },
  };

  let result = render(
    <TranslatorProvider
      language="nl"
      fallbackLanguage="en"
      library={library}
      getTranslationRegistry={async (language) => {
        if (language !== 'nl') {
          throw new Error('This should not be requested...');
        }

        await sleep(5);

        return {
          test: 'Dit is een test waarde',
        };
      }}
    >
      <Example translationKey="test" />
    </TranslatorProvider>
  );

  let value = result.queryByTestId(TEST_ID).innerHTML;
  expect(value).toEqual('This is a test value');

  let element = await waitFor(() => screen.getByText(/waarde/i));

  expect(element.innerHTML).toEqual('Dit is een test waarde');
});

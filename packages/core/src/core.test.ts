import { translator } from './core';

test('Basic core test', () => {
  let library = {
    en: {
      greeting: 'Hello {name}, how are you?',
    },
    nl: {
      greeting: 'Hallo {name}, hoe gaat het?',
    },
  };

  let translatorInstance = translator({
    fallbackLanguage: 'en',
    library,
  });

  expect(
    translatorInstance.translate({
      key: 'greeting',
      values: {
        name: 'Mark',
      },
    })
  ).toBe('Hello Mark, how are you?');

  expect(
    translatorInstance.translate({
      key: 'greeting',
      language: 'en',
      values: {
        name: 'Mark',
      },
    })
  ).toBe('Hello Mark, how are you?');

  expect(
    translatorInstance.translate({
      key: 'greeting',
      language: 'nl',
      values: {
        name: 'Mark',
      },
    })
  ).toBe('Hallo Mark, hoe gaat het?');
});

test('Add languages manually test', () => {
  let translatorInstance = translator({
    fallbackLanguage: 'en',
  });

  translatorInstance.addLanguage('en', {
    footer: 'Made with love in Belgium by Blazingly.io',
  });

  expect(
    translatorInstance.translate({
      key: 'footer',
    })
  ).toBe('Made with love in Belgium by Blazingly.io');

  expect(
    translatorInstance.translate({
      key: 'footer',
      language: 'nl',
    })
  ).toBe('Made with love in Belgium by Blazingly.io');

  translatorInstance.addLanguage('nl', {
    footer: 'Ontwikkeld in Belgie door Blazingly.io',
  });

  expect(
    translatorInstance.translate({
      key: 'footer',
      language: 'nl',
    })
  ).toBe('Ontwikkeld in Belgie door Blazingly.io');
});

test('Nested translations', () => {
  let library = {
    en: {
      intro: {
        welcome: 'Welcome {name} to translator, press the big red button to get started',
      },
    },
    nl: {
      intro: {
        welcome: 'Welkom {name} op de translator app, druk op de grote rode knop om te starten',
      },
    },
  };

  let translatorInstance = translator({
    fallbackLanguage: 'en',
    library,
  });

  expect(
    translatorInstance.translate({
      key: 'intro.welcome',
      values: {
        name: 'Bob',
      },
    })
  ).toBe('Welcome Bob to translator, press the big red button to get started');

  expect(
    translatorInstance.translate({
      key: 'intro.welcome',
      language: 'nl',
      values: {
        name: 'Bob',
      },
    })
  ).toBe('Welkom Bob op de translator app, druk op de grote rode knop om te starten');
});

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
  ).toEqual({ value: 'Hello Mark, how are you?', isTranslated: true });

  expect(
    translatorInstance.translate({
      key: 'greeting',
      language: 'en',
      values: {
        name: 'Mark',
      },
    })
  ).toEqual({ value: 'Hello Mark, how are you?', isTranslated: true });

  expect(
    translatorInstance.translate({
      key: 'greeting',
      language: 'nl',
      values: {
        name: 'Mark',
      },
    })
  ).toEqual({ value: 'Hallo Mark, hoe gaat het?', isTranslated: true });
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
  ).toEqual({ value: 'Made with love in Belgium by Blazingly.io', isTranslated: true });

  expect(
    translatorInstance.translate({
      key: 'footer',
      language: 'nl',
    })
  ).toEqual({ value: 'Made with love in Belgium by Blazingly.io', isTranslated: false });

  translatorInstance.addLanguage('nl', {
    footer: 'Ontwikkeld in Belgie door Blazingly.io',
  });

  expect(
    translatorInstance.translate({
      key: 'footer',
      language: 'nl',
    })
  ).toEqual({ value: 'Ontwikkeld in Belgie door Blazingly.io', isTranslated: true });
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
  ).toEqual({ value: 'Welcome Bob to translator, press the big red button to get started', isTranslated: true });

  expect(
    translatorInstance.translate({
      key: 'intro.welcome',
      language: 'nl',
      values: {
        name: 'Bob',
      },
    })
  ).toEqual({ value: 'Welkom Bob op de translator app, druk op de grote rode knop om te starten', isTranslated: true });
});

test('Should return key for unknown key', () => {
  let library = {
    en: {
      welcome: 'Welcome {name} to translator, press the big red button to get started',
    },
    nl: {
      welcome: 'Welkom {name} op de translator app, druk op de grote rode knop om te starten',
    },
  };

  let translatorInstance = translator({
    fallbackLanguage: 'en',
    library,
  });

  expect(
    translatorInstance.translate({
      key: 'does-not-exist',
      values: {
        name: 'Bob',
      },
    })
  ).toEqual({ value: 'does-not-exist', isTranslated: false });

  expect(
    translatorInstance.translate({
      key: undefined,
      values: {
        name: 'Bob',
      },
    })
  ).toEqual({ value: '', isTranslated: false });
});

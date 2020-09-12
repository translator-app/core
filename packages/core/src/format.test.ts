import { format } from './format';

test('Named arguments are replaced', () => {
  let result = format('Hello {name}, how are you?', { name: 'Mark' });
  expect(result).toBe('Hello Mark, how are you?');
});

test('Named arguments at the start of strings are replaced', () => {
  let result = format('{likes} people have liked this', {
    likes: 123,
  });
  expect(result).toBe('123 people have liked this');
});

test('Named arguments at the end of string are replaced', () => {
  let result = format('Please respond by {date}', {
    date: '01/01/2015',
  });
  expect(result).toBe('Please respond by 01/01/2015');
});

test('Multiple named arguments are replaced', () => {
  let result = format('Hello {name}, you have {emails} new messages', {
    name: 'Anna',
    emails: 5,
  });
  expect(result).toBe('Hello Anna, you have 5 new messages');
});

test('Missing named arguments become 0 characters', () => {
  let result = format('Hello{name}, how are you?', {});
  expect(result).toBe('Hello, how are you?');
});

test('Named arguments can be escaped', () => {
  let result = format('Hello {{name}}, how are you?', { name: 'Mark' });
  expect(result).toBe('Hello {name}, how are you?');
});

test('Array arguments are replaced', () => {
  let result = format('Hello {0}, how are you?', ['Mark']);
  expect(result).toBe('Hello Mark, how are you?');
});

test('Array arguments at the start of strings are replaced', () => {
  let result = format('{0} people have liked this', [123]);
  expect(result).toBe('123 people have liked this');
});

test('Should return empty string if template is undefined', () => {
  let result = format(undefined, [123]);
  expect(result).toBe('');
});

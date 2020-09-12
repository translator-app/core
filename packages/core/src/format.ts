import { flattenObject } from './utils';

const TEMPLATE_REGEX = /\{([0-9a-zA-Z_.]+)\}/g;

export function format(template: string, values: any = {}) {
  let flattenedValues = flattenObject(values);

  return template.replace(TEMPLATE_REGEX, (match, key, index) => {
    if (template[index - 1] === '{' && template[index + match.length] === '}') {
      return key;
    } else {
      let cleanedKey = key.trim();
      let result = flattenedValues.hasOwnProperty(cleanedKey) ? flattenedValues[cleanedKey] : null;
      if (result === null || result === undefined) {
        return '';
      } else {
        return result;
      }
    }
  });
}

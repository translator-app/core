const TEMPLATE_REGEX = /\{([0-9a-zA-Z_.]+)\}/g;

function flattenObject(value: any, keyParts = [], flattenedObject: any = {}): any {
  for (let key of Object.keys(value)) {
    let subValue = value[key];
    let newKeyParts = [...keyParts, key];
    if (typeof subValue !== 'object') {
      flattenedObject[newKeyParts.join('.')] = subValue;
    } else {
      flattenObject(subValue, newKeyParts, flattenedObject);
    }
  }

  return flattenedObject;
}

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

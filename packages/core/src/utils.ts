export function flattenObject(value: any, keyParts = [], flattenedObject: any = {}): any {
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

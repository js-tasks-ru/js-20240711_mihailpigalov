/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(field) {
    const properties = field.split('.');
  
    return function(obj) {
      return properties.reduce((acc, prop) => {
        if (acc !== null && acc !== undefined && acc.hasOwnProperty(prop)) {
          return acc[prop];
        }
        return undefined;
      }, obj);
    };
}
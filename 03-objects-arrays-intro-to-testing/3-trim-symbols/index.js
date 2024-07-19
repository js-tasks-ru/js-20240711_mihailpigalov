/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */

export function trimSymbols(str, maxAllowed = Number.MAX_SAFE_INTEGER) {
    if (maxAllowed === 0) {
      return '';
    }
    
    let result = '';
    let currentChar = '';
    let count = 0;
  
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== currentChar) {
        currentChar = str[i];
        count = 1;
        result += currentChar;
      } else {
        count++;
        if (count <= maxAllowed) {
          result += currentChar;
        }
      }
    }
  
    return result;
}
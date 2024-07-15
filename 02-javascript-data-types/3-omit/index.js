/**
 * omit - creates an object composed of enumerable property fields
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to omit
 * @returns {object} - returns the new object
 */
export const omit = (obj, ...fields) => {
    // Создаем новый объект, чтобы не изменять исходный
    const result = {};

    // Перебираем все ключи и значения исходного объекта
    for (const [key, value] of Object.entries(obj)) {
    // Если ключ не находится в списке fields, добавляем его в новый объект
    if (!fields.includes(key)) {
        result[key] = value;
    }
  }

  return result;
};

/**
 * pick - Creates an object composed of the picked object properties:
 * @param {object} obj - the source object
 * @param {...string} fields - the properties paths to pick
 * @returns {object} - returns the new object
 */
export const pick = (obj, ...fields) => {

    // Получаем массив пар ключ-значение из исходного объекта
  const entries = Object.entries(obj);

  // Фильтруем пары, удаляя те, ключи которых находятся в списке fields
  const filteredEntries = entries.filter(([key]) => fields.includes(key));

  // Преобразуем отфильтрованные пары обратно в объект
  const result = filteredEntries.reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  return result;
};

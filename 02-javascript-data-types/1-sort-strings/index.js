/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const sortedArray = [...arr];

    const isAscending = param === 'asc';

    sortedArray.sort((a, b) => {
        const comparison = a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' });
        return isAscending ? comparison : -comparison;
    });

    return sortedArray;
}

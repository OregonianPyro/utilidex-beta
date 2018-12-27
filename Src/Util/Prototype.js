//Similar to String.replace(), except it replaces everything instead of once, so no more chaining .replace().replace()
/**
 * 
 * @param {string} search The term or term to search for and replace within a string. 
 * @param {string} replacement The string to replace the search-term with.
 */
String.prototype.replaceAll = function (search, replacement) {
    return this.replace(RegExp(search, "gi"), replacement);
};
//Returns a random element from an array, easily and quickly.
/**
 * 
 */
Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};
//Returns all keys and values of an object into an array. Easy and quick way to get all keys and values of an object. 
//If you want a key, it would be Object.getAll(obj)[0].split('|')[1]
/**
 * 
 * @param {object} obj The object to fetch all key and values from. 
 */
Object.prototype.getAll = function (obj) {
    const keys = Object.keys(obj);
    const values = Object.values(obj);
    const output = [];
    for (let i = 0; i < keys.length; i++) {
        output.push(`${keys[i]} | ${values[i]}`);
    };
    return output;
};
//Removes a simple key from a simple array.
/**
 * 
 * @param {string} key The key to remove from the array. 
 * @param {integer} num Optional number to remove from the rght of the key. Defaults to 1 if left empty. 
 */
Array.prototype.remove = function (key, num = 1) {
    if (!this.includes(key)) return undefined;
    return this.splice(this.indexOf(key), num);
};
//Removes an object from an array.
/**
 * 
 * @param {string} key The key to remove from the array. 
 * @param {integer} num Optional number to remove from the rght of the key. Defaults to 1 if left empty. 
 */
// Array.prototype.removeObject = function (key, val, num = 1) {
//     let result;
//     let index;
//     for (let i = o; i < this.length; i++) {
//         if (this[i][key])
//     };
// };

String.prototype.toProperCase = function () {
    return this.replace(/([^\W_]+[^\s-]*) */g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
};
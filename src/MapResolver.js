'use strict';

const escapeRegex = require('./helpers/EscapeRegex.js');
const getError = require('./helpers/Errors.js');


let _delimiter = {
  start: "${",
  end: "}"
};
let _map = undefined;


/**
 * Create a new instance from the input Map with resolved values
 *
 * @param {Map<string, string>} map The input Map
 * @param {{start: string, end: string}} [delimiter] The delimier's start and end which acts as a placeholder for referencing values
 * @returns {Map<string, string>} A new instance of the input Map with resolved values
 */
module.exports = (map, delimiter) => {

  //Before doing anything we should check if the inputs are valid
  checkInputs(map, delimiter);

  _map = new Map(map);
  _delimiter = delimiter || _delimiter;
  const PLACEHOLDER_REGEX = new RegExp(escapeRegex(_delimiter.start) + "\\w+" + escapeRegex(_delimiter.end), 'g');

  // Iterate over map entries
  for (let [key, value] of _map.entries()) {
    // for each map entry's value we want to extract all placeholders
    let placeholders = extractPlaceholders(value, PLACEHOLDER_REGEX);
    // if placeholders is not empty, it means that there are some placeholders to be replaced
    if (placeholders.length) {
      // evaluate placeholders in the map entry's value
      _map.set(key, resolveText(value, placeholders));
    }
  }
  return _map;
}

/**
 * Extracts all placeholders in text by using a regex expression
 * @param {string} text
 * @param {RegExp} regex a Regex matching the placeholder defined by a delimiter
 * @returns {Array.<{placeholder: string, replaceWithKey: string}> | Array} an array of placeholders and they key they will be replaced with
 */
const extractPlaceholders = (text, regex) => {
  let matches = text.match(regex);
  return matches ? matches.map(placeholder => {
    return {
      placeholder,
      replaceWithKey: placeholder.replace(_delimiter.start, '').replace(_delimiter.end, '')
    }
  }) : [];
}

/**
 * Evaluates a text by substituting placeholders with their values from they map under the mapped key
 * If the map doesn't contain a key that matches the placeholder, an empty string will be used to evaluate the placeholder
 *
 * @param {string} text the text to be resolved
 * @param {Array.<{placeholder: string, replaceWithKey: string}>} placeholders list of placeholders and the mapped key
 * @returns {string} the resolved text
 */
const resolveText = (text, placeholders) => {
  var resolvedText = placeholders.reduce(
    (resolvedText, placeholder) => substitute(resolvedText, placeholder),
    text
  );
  return resolvedText;
}

/**
 * The resolveText reducer which substitutes a placeholder with it's a value for each iteration
 *
 * @param {string} text the text to be resolved (value resulting from the previous call of the reducer)
 * @param {{placeholder: string, replaceWithKey: string}} placeholderEntry the object that tcontains the placeholder and they mapped key
 * @returns {string} resolved text for the next call of the reducer
 */
const substitute = (text, placeholderEntry) => {
  let key = placeholderEntry.replaceWithKey;
  let placeholder = placeholderEntry.placeholder;
  // Check if the map has the key
  if (_map.has(key)) {
    // substitute the placeholder by they key's value from the map
    return text.replace(placeholder, _map.get(key));
  } else {
    return text.replace(placeholder, '');
  }
}

const checkInputs = (map, delimiter) => {
  if (!map) {
    throw getError(1);
  }
  if (!(map instanceof Map)) {
    throw getError(2);
  }
  // Since A Map's keys and values can be any value we should only allow string values
  if (Array.from(map.keys()).some(k => (typeof k !== 'string' || k === "")) || Array.from(map.values()).some(v => (typeof v !== 'string' || v === ""))) {
    throw getError(3);
  }
  if (delimiter !== undefined && delimiter !== null) {
    if (!Object.getPrototypeOf(delimiter).isPrototypeOf(Object)) {
      throw getError(4);
    }
    if (!['start', 'end'].every(prop => delimiter.hasOwnProperty(prop))) {
      throw getError(5);
    }
    if (Object.values(delimiter).some((el) => (typeof el !== 'string' || el === ""))) {
      throw getError(6);
    }
  }

}
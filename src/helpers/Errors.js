const errosMap = new Map([
  [1, new Error('No Map was provided for the resolver')],
  [2, new TypeError('Invalid value passed into the first argument. Expected a type of Object')],
  [3, new TypeError('Map keys and values should be a non empty string')],
  [4, new TypeError('Invalid value passed into the second argument. Expected a type of Object')],
  [5, new Error('Invalid object passed into the second argument. Expected {start: string, end: string}')],
  [6, new TypeError('The delimiter start and end should be a non empty string')],
]);


module.exports = (number) => {
  return errosMap.get(number);
}
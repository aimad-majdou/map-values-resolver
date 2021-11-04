const getError = require('../src/helpers/Errors.js');
const resolver = require('../src/MapResolver.js');


describe("It should throw an error", () => {

  const map = new Map();

  test('No Map was provided for the resolver', () => {
    expect(()=> {
      resolver()
    }).toThrow(getError(1));
  });

  test('Invalid value passed into the first argument. Expected a type of Object', () => {
    expect(() => { resolver("test")}).toThrow(getError(2));
    expect(() => { resolver(5)}).toThrow(getError(2));
  });

  test('Map keys and values should be a non empty string', () => {
    let map1 = new Map();
    map1.set("", "value1");
    map1.set("key2", "value2");
    expect(() => { resolver(map1)}).toThrow(getError(3));

    let map2 = new Map();
    map2.set("key1", "value1");
    map2.set(2, "value2");
    expect(() => { resolver(map2)}).toThrow(getError(3));

    let map3 = new Map();
    map3.set("key1", {});
    expect(() => { resolver(map3)}).toThrow(getError(3));
  });

  test('Invalid value passed into the second argument. Expected a type of Object', () => {
    let map = new Map();
    map.set("key1", "value1");
    map.set("key2", "value2");

    expect(() => { resolver(map, ["${", "}"])}).toThrow(getError(4));
    expect(() => { resolver(map, "${}")}).toThrow(getError(4));
    expect(() => { resolver(map, 100)}).toThrow(getError(4));
  });

  test('Invalid object passed into the second argument. Expected {start: string, end: string}', () => {
    let map = new Map();
    map.set("key1", "value1");
    map.set("key2", "value2");

    expect(() => { resolver(map, {})}).toThrow(getError(5));
    expect(() => { resolver(map, {delimeter: "#{}"})}).toThrow(getError(5));
  });

  test('Invalid object passed into the second argument. Expected {start: string, end: string}', () => {
    let map = new Map();
    map.set("key1", "value1");
    map.set("key2", "value2");

    expect(() => { resolver(map, {start: "${", end: ""})}).toThrow(getError(6));
    expect(() => { resolver(map, {start: "#{}", end: 6})}).toThrow(getError(6));
  });


});

describe("It should not throw an error", () => {

  test('It should not throw an error', () => {
    let map = new Map();
    map.set("key1", "value1");
    map.set("key2", "value2");
    expect(() => { resolver(map, null)}).not.toThrow(new Error());
    expect(() => { resolver(map, undefined)}).not.toThrow(new Error());
    expect(() => { resolver(map)}).not.toThrow(new Error());
  });

});

describe("Resolve Map", () => {

  test('It should use the default placeholder `${KEY}`', () => {
    let map = new Map();
    map.set("key1", "value1");
    map.set("key2", "${key1}value2");
    map = resolver(map);

    expect(map.get("key2")).toEqual("value1value2");
  });

  test('It should use the provided placeholder', () => {
    let map = new Map();
    map.set("key1", "value1");
    map.set("key2", "#{key1}value2");
    map = resolver(map, {start: "#{", end: "}"});

    expect(map.get("key2")).toEqual("value1value2");
  });

  test('It should resolve not found keys to empty strings', () => {
    let map = new Map();
    map.set("key1", "value1");
    map.set("key2", "#{key5}value2");
    map.set("key3", "#{key4}value3#{key1}");
    map = resolver(map, {start: "#{", end: "}"});

    expect(map.get("key2")).toEqual("value2");
    expect(map.get("key3")).toEqual("value3value1");
  });

});
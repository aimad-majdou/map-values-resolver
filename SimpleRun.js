#!/usr/bin/env node

const resolver = require('./dist/index.js');

const map = new Map();

map.set("key1", "Value1");
map.set("key2", "Value2 ${key1}");
console.log("Input Map:", map);

let newMap = resolver(map);
console.log("Resolved Map:", newMap);

///

const map2 = new Map(newMap);

map2.set("key3", "#{key1} Value3");
console.log("Input Map with different delimiter:", map2);

newMap = resolver(map2, {start: "#{", end: "}"});
console.log("Resolved Map:", newMap);


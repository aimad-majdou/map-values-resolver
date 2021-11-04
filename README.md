# map-resolver

## Table of Contents

- [About](#about)
- [Example](#example)
- [Usage](#usage)

## About <a name = "about"></a>

Simple plugin that resolves variable in an input Map by evaluating variables (marked by a delimiter and referencing a map value using map keys) with their value.

## Example <a name = "example"></a>

If the input map is:

```
Map(2) {
  'key1' => 'Value1',
  'key2' => 'Value2 ${key1}',
}
```

The output would be:

```
Map(2) {
  'key1' => 'Value1',
  'key2' => 'Value2 Value1',
}
```

## Usage <a name = "usage"></a>

```
resolver(map: Map<string, string>, delimiter?: {
    start: string;
    end: string;
})
```

- Options:
  -   ```map```: **Map<string, string>** The input map
  > The map keys and values should be of type string
  -   ```delimiter```: **{ ```start```: string, ```end```: string}** *(Optional)* The used delimeter
  > The second parameter is optional, if not specified the default delimiter (${KEY}) will be used





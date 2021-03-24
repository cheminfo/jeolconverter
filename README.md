# jeolconverter

[![NPM version][npm-image]][npm-url]
[![build status][ci-image]][ci-url]
[![Test coverage][codecov-image]][codecov-url]
[![npm download][download-image]][download-url]

read JEOL NMR files.

## Installation

`$ npm i jeolconverter`

## Usage

```js
import { readFileSync } from 'fs';

import { parseJEOL } from 'jeolconverter';

const buffer = readFileSync('pathToFile');
let parsed = parseJEOL(buffer);
console.log(parsed);
```

## Acknowledgements

The data provided as test examples in this package were found [here](https://dataverse.harvard.edu/dataverse/cenaptnmr) thanks to the research group of Guido Pauli.

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/jeolconverter.svg
[npm-url]: https://www.npmjs.com/package/jeolconverter
[ci-image]: https://github.com/cheminfo/jeolconverter/workflows/Node.js%20CI/badge.svg?branch=master
[ci-url]: https://github.com/cheminfo/jeolconverter/actions?query=workflow%3A%22Node.js+CI%22
[codecov-image]: https://img.shields.io/codecov/c/github/cheminfo/jeolconverter.svg
[codecov-url]: https://codecov.io/gh/cheminfo/jeolconverter
[download-image]: https://img.shields.io/npm/dm/jeolconverter.svg
[download-url]: https://www.npmjs.com/package/jeolconverter

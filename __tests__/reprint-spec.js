/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 *
 * @flow
 */

import fs from 'fs';
import reprint from '../src/reprint-js';
import path from 'path';

function readFileP(filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}

// Helpful for debugging.
const only = new Set([
  // 'readme-demo',
]);

function getTests() {
  if (only.size > 0) {
    return only;
  }
  const files = fs.readdirSync(path.join(__dirname, 'fixtures/reprint/'));
  const tests = new Set();
  for (const file of files) {
    if (/\.test$/.test(file)) {
      tests.add(file.substring(0, file.length - 5));
    }
  }
  return tests;
}

describe('reprint', () => {
  getTests().forEach(name => {
    it(`should ${name}`, async () => {
      const testPath = path.join(__dirname, 'fixtures/reprint/' + name + '.test');
      const expectedPath = path.join(__dirname, 'fixtures/reprint/' + name + '.expected');
      const fileContents = await readFileP(testPath);
      const actual = reprint(fileContents).source;
      const expected = await readFileP(expectedPath);
      // Helpful for debugging
      // firstDifference(actual, expected);
      expect(actual).toBe(expected);
    });
  });
});

// eslint-disable-next-line no-unused-vars
function firstDifference(a, b) {
  /* eslint-disable no-console */
  for (let i = 0; i < a.length && i < b.length; i++) {
    if (a.charAt(i) !== b.charAt(i)) {
      console.log();
      console.log(i);
      console.log('a: "' + a.charAt(i) + '"');
      console.log('b: "' + b.charAt(i) + '"');
      console.log();
      break;
    }
  }
  /* eslint-enable no-console */
}

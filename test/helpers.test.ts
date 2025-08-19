import { expect, test } from '@rstest/core';
import { displayCodePointer, makeCodeFrame } from '../src/generateError';
import { getHtmlScripts } from '../src/generateHtmlScripts';

test('#getHtmlScripts - should extract inline scripts correctly', async () => {
  expect(
    getHtmlScripts(`<html>
    <head>
      <title>Title</title>
    </head>
    <body>
      <h1>Hello, World!</h1>
      <script src="external.js"></script>
      <script>
        console.log('Inline script 1');
      </script>
      <script type="text/javascript">
        console.log('Inline script 2');
      </script>
      <script type="application/javascript">
        console.log('Inline script 3');
      </script>
      <script>
        var message = "This is a test script.";
        console.log(message);
        alert("This is an alert.\nIt has a line break.");
      </script>
    </body>
  </html>`).join('\n'),
  ).toEqual(`console.log('Inline script 1');
console.log('Inline script 2');
console.log('Inline script 3');
var message = \"This is a test script.\";
        console.log(message);
        alert(\"This is an alert.
It has a line break.\");`);
});

test('#getHtmlScripts - should not extract external scripts and JSON scripts', async () => {
  expect(
    getHtmlScripts(`<html>
    <head>
      <title>Title</title>
    </head>
    <body>
      <h1>Hello, World!</h1>
      <script type="application/json">{"foo":"bar"}</script>
      <script src="external.js"></script>
    </body>
  </html>`),
  ).toEqual([]);
});

test('#makeCodeFrame = should make code frame correctly', () => {
  const lines = [
    'const a = 1;',
    '',
    'var b = 2;',
    '',
    'console.log(() => {',
    '  return a + b;',
    '});',
    '',
    'var c = 3;',
  ];

  expect(makeCodeFrame(lines, 0)).toEqual(`
[33m   > 1 | const a = 1;[39m
[90m     2 | [39m
[90m     3 | var b = 2;[39m
[90m     4 | [39m`);
  expect(makeCodeFrame(lines, 4)).toEqual(`
[90m     2 | [39m
[90m     3 | var b = 2;[39m
[90m     4 | [39m
[33m   > 5 | console.log(() => {[39m
[90m     6 |   return a + b;[39m
[90m     7 | });[39m
[90m     8 | [39m`);
});

test('#displayCodePointer - should display code pointer correctly', () => {
  const code =
    '(self.webpackChunktmp=self.webpackChunktmp||[]).push([[179],{530:()=>{console.log(1);let e=1;e="2"}},e=>{var l;l=530,e(e.s=l)}]);';
  expect(`\n  code:    ${displayCodePointer(code, 66)}`).toEqual(`
  code:    .webpackChunktmp||[]).push([[179],{530:()=>{console.log(1);let e=1;e="2"}},e=>{v
[33m                                                  ^[39m`);
});

# rsbuild-plugin-check-syntax

An Rsbuild plugin to check the syntax compatibility of output files.

<p>
  <a href="https://npmjs.com/package/rsbuild-plugin-example">
   <img src="https://img.shields.io/npm/v/rsbuild-plugin-example?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
</p>

## Usage

Install:

```bash
npm add @rsbuild/plugin-check-syntax -D
```

Add plugin to your `rsbuild.config.ts`:

```ts
// rsbuild.config.ts
import { pluginExample } from "rsbuild-plugin-example";

export default {
  plugins: [pluginExample()],
};
```

## Options

### foo

Some description.

- Type: `string`
- Default: `undefined`
- Example:

```js
pluginExample({
  foo: "bar",
});
```

## License

[MIT](./LICENSE).

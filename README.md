# @rsbuild/plugin-check-syntax

An Rsbuild plugin to check the syntax compatibility of output files.

This plugin tries to find incompatible syntax in the output files with the current browserslist value. If any incompatible syntax is found, it will print detailed information to the terminal and abort the build.

<p>
  <a href="https://npmjs.com/package/@rsbuild/plugin-check-syntax">
   <img src="https://img.shields.io/npm/v/@rsbuild/plugin-check-syntax?style=flat-square&colorA=564341&colorB=EDED91" alt="npm version" />
  </a>
  <img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="license" />
  <a href="https://npmcharts.com/compare/@rsbuild/plugin-check-syntax?minimal=true"><img src="https://img.shields.io/npm/dm/@rsbuild/plugin-check-syntax.svg?style=flat-square&colorA=564341&colorB=EDED91" alt="downloads" /></a>
</p>

## Usage

Install:

```bash
npm add @rsbuild/plugin-check-syntax -D
```

Add plugin to your `rsbuild.config.ts`:

```ts
// rsbuild.config.ts
import { pluginCheckSyntax } from "@rsbuild/plugin-check-syntax";

export default {
  plugins: [pluginCheckSyntax()],
};
```

## Enable Detection

After registering the Check Syntax plugin, Rsbuild will perform syntax checking after production builds.

When Rsbuild detects incompatible advanced syntax in the build artifacts, it will print the error logs in the terminal and exit the current build process.

### Error Logs

The format of the error logs is as follows, including the source file, artifact location, error reason, and source code:

```bash
error   [@rsbuild/plugin-check-syntax] Find some syntax that does not match "ecmaVersion <= 2015":

  Error 1
  source:  /node_modules/foo/index.js:1:0
  output:  /dist/static/js/main.3f7a4d7e.js:2:39400
  reason:  Unexpected token (1:178)
  code:
     9 |
    10 | var b = 2;
    11 |
  > 12 | console.log(() => {
    13 |   return a + b;
    14 | });
    15 |
```

Currently, syntax checking is implemented based on AST parser. Each time it performs a check, it can only identify the first incompatible syntax found in the file. If there are multiple incompatible syntaxes in the file, you need to fix the detected syntax and re-run the check.

If the corresponding source location is not shown in the log, try setting [output.minify](/config/output/minify) to false and rebuild again.

Note that displaying source code information depends on the source map file. You can configure the [output.sourceMap](/config/output/source-map) option to generate source map files during production builds.

```js
export default {
  output: {
    sourceMap: {
      js:
        process.env.NODE_ENV === "production"
          ? "source-map"
          : "cheap-module-source-map",
    },
  },
};
```

### Solutions

If a syntax error is detected, you can handle it in the following ways:

- If you want to downgrade this syntax to ensure good code compatibility, you can compile the specified module through the [source.include](https://rsbuild.dev/config/source/include) config.
- If you don't want to downgrade the syntax, you can adjust the project's [browserslist](https://rsbuild.dev/guide/advanced/browserslist) to match the syntax, or set the [ecmaVersion](#ecmaVersion) option.
- If you don't want to check the syntax of specified files, you can use the [exclude](#exclude) option to exclude the files to be checked.

Take `/node_modules/foo/index.js` as an example, you can add it to [source.include](https://rsbuild.dev/config/source/include) to compile it:

```ts
// rsbuild.config.ts
export default {
  source: {
    include: [/node_modules[\\/]foo[\\/]/],
  },
};
```

## Options

### targets

- **Type:** `string[]`
- **Default:** `The browserslist configuration of the current project`

`targets` is the target browser range, its value is a standard browserslist. Check Syntax plugin will by default read the current project's browserslist configuration, so you usually don't need to manually configure the `targets` option.

Rsbuild will read the value of `targets` and automatically deduce the minimum ECMAScript syntax version that can be used in the build artifacts, such as ES5 or ES2015.

- **Example:**

For example, if the target browsers to be compatible with in the project are Chrome 53 and later versions, you can add the following configuration:

```ts
pluginCheckSyntax({
  targets: ["chrome >= 53"],
});
```

Rsbuild will deduce that the ECMAScript syntax version that can be used with `chrome >= 53` is ES2015. When the build artifacts contain `ES2016` or higher syntax, it triggers syntax error prompts.

> If you want to learn more about how to use browserslist, please refer to ["Browserslist"](https://rsbuild.dev/guide/advanced/browserslist).

### ecmaVersion

- **Type:** `3 | 5 | 6 | 2015 | 2016 | 2017 | 2018 | 2019 | 2020 | 2021 | 2022 | 2023 | 2024 | 2025 | 'latest'`
- **Default:** `Automatically analyzed based on targets`

`ecmaVersion` represents the minimum ECMAScript syntax version that can be used in the build artifact.

> If `ecmaVersion` is not set, Check Syntax plugin will infer the ECMAScript version based on `targets`. Currently, the supported inference range is `es5` ~ `es2018`.

- **Example:**

For example, if the minimum ECMAScript syntax version that can be used in the build artifacts is ES2020, you can add the following configuration:

```ts
pluginCheckSyntax({
  ecmaVersion: 2020,
});
```

At this time, the build artifacts can include all syntax supported by ES2020, such as optional chaining.

### exclude

- **Type:** `RegExp | RegExp[]`
- **Default:** `undefined`

`exclude` is used to exclude a portion of source files during detection. You can pass in one or more regular expressions to match the paths of source files. Files that match the regular expression will be ignored and will not trigger syntax checking.

- **Example:**

For example, to ignore files under the `node_modules/foo` directory:

```ts
pluginCheckSyntax({
  exclude: /node_modules\/foo/,
});
```

### excludeOutput

- **Type:** `RegExp | RegExp[]`
- **Default:** `undefined`

`excludeOutput` is used to exclude a portion of output files before detection. You can pass in one or more regular expressions to match the paths of output files. Files that match the regular expression will be ignored and will not trigger syntax checking.

- **Example:**

For example, to ignore files under the `dist/js` directory:

```ts
pluginCheckSyntax({
  excludeOutput: /dist\/js/,
});
```

### excludeErrorLogs

- **Type:** `('source' | 'output' | 'reason' | 'code')[]`
- **Default:** `[]`

`excludeErrorLogs` is used to ignore specified syntax error messages after detection. You can pass in one or more error message types to ignore.

- **Example:**

For example, to ignore the reason and code displayed in the terminal.

```ts
pluginCheckSyntax({
  excludeErrorLogs: ["reason", "code"],
});
```

## Limitations

### Syntax detection range

This plugin only checks incompatible syntax in the outputs and cannot detect missing polyfills.

### Syntax detection accuracy

The syntax detection in this plugin may have some limitations due to the granularity difference between the AST parser and the actual compiler:

1. **Parser Granularity**: This plugin uses [Acorn](https://github.com/acornjs/acorn) as its parser, which can only check syntax compatibility at the ECMAScript version level (like ES5, ES2015, etc).

2. **Compiler Granularity**: The JavaScript compiler (such as SWC) is more fine-grained and can handle individual syntax features independently. For example, it knows that Firefox 45 supports arrow functions even though it doesn't support all ES2015 features.

This difference can lead to false positives. For example:

- When your browserslist includes `firefox >= 45`:
  - SWC correctly determines that arrow functions can be used since Firefox 45 supports them
  - This plugin will report an error because Firefox 45 doesn't support all ES2015 features

Therefore, you might encounter situations where the compiled output is actually compatible with your target browsers, but this plugin still reports errors due to this granularity mismatch.

## License

[MIT](./LICENSE).

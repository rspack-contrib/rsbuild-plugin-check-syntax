import fs from 'node:fs';
import { parse } from 'acorn';
import { browserslistToESVersion } from 'browserslist-to-es-version';
import { generateError } from './generateError.js';
import { generateHtmlScripts } from './generateHtmlScripts.js';
import type {
  AcornParseError,
  CheckSyntaxExclude,
  CheckSyntaxOptions,
  ECMASyntaxError,
  EcmaVersion,
  SyntaxErrorKey,
} from './types.js';
import { checkIsExclude } from './utils.js';

const HTML_REGEX = /\.html$/;
export const JS_REGEX: RegExp = /\.(?:js|mjs|cjs|jsx)$/;

export class CheckSyntax {
  errors: ECMASyntaxError[] = [];

  ecmaVersion: EcmaVersion;

  targets: string[];

  rootPath: string;

  exclude: CheckSyntaxExclude | undefined;

  excludeOutput: CheckSyntaxExclude | undefined;

  excludeErrorLogs: SyntaxErrorKey[];

  constructor(
    options: CheckSyntaxOptions &
      Required<Pick<CheckSyntaxOptions, 'targets'>> & {
        rootPath: string;
      },
  ) {
    if (!options) {
      throw new Error('[CheckSyntaxRspackPlugin] `options` is required.');
    }
    if (!options.targets && !options.ecmaVersion) {
      throw new Error(
        '[CheckSyntaxRspackPlugin] `targets` or `ecmaVersion` option is required',
      );
    }

    this.targets = options.targets;
    this.exclude = options.exclude;
    this.excludeOutput = options.excludeOutput;
    this.rootPath = options.rootPath;
    this.ecmaVersion =
      options.ecmaVersion || browserslistToESVersion(this.targets);
    this.excludeErrorLogs = options.excludeErrorLogs || [];
  }

  async check(filepath: string, code?: string) {
    // If the code is provided, no need to read file.
    if (code) {
      return await this.tryParse(filepath, code);
    }

    if (HTML_REGEX.test(filepath)) {
      const htmlScripts = await generateHtmlScripts(filepath);
      await Promise.all(
        htmlScripts.map(async (script) => {
          if (!checkIsExclude(filepath, this.exclude)) {
            await this.tryParse(filepath, script);
          }
        }),
      );
    }

    if (JS_REGEX.test(filepath)) {
      const jsScript = await fs.promises.readFile(filepath, 'utf-8');
      await this.tryParse(filepath, jsScript);
    }
  }

  async tryParse(filepath: string, code: string) {
    try {
      parse(code, { ecmaVersion: this.ecmaVersion });
    } catch (_: unknown) {
      const err = _ as AcornParseError;

      const error = await generateError({
        err,
        code,
        filepath,
        exclude: this.exclude,
        rootPath: this.rootPath,
      });

      if (error) {
        this.errors.push(error);
      }
    }
  }
}

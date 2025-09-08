import type { ecmaVersion as EcmaVersion } from 'acorn';

export type { EcmaVersion };

export type CheckSyntaxExclude = RegExp | RegExp[];

export type CheckSyntaxOptions = {
  /**
   * The target browser range of the project.
   * Its value is a standard browserslist array.
   */
  targets?: string[];
  /**
   * Excludes a portion of source files during detection.
   * You can pass in one or more regular expressions to match the paths of source files.
   */
  exclude?: CheckSyntaxExclude;
  /**
   * Excludes files by output path before detection.
   * You can pass in one or more regular expressions to match the paths of source files.
   */
  excludeOutput?: CheckSyntaxExclude;
  /**
   * Excludes specified error messages.
   * You can pass in one or more regular expressions to match the reasons.
   */
  excludeErrorMessage?: CheckSyntaxExclude;
  /**
   * Ignores specified syntax error messages after detection.
   * You can pass in one or more error message types to ignore.
   */
  excludeErrorLogs?: SyntaxErrorKey[];
  /**
   * The minimum ECMAScript syntax version that can be used in the build artifact.
   * The priority of `ecmaVersion` is higher than `targets`.
   */
  ecmaVersion?: EcmaVersion;
};

export interface Location {
  line: number;
  column: number;
}

export interface File {
  path: string;
  line: number;
  column: number;
}

interface SyntaxErrorOptions {
  source: File & { code: string };
  output?: File;
}

export class ECMASyntaxError extends Error {
  source: File & { code: string };

  output: File | undefined;

  constructor(message: string, options: SyntaxErrorOptions) {
    super(message);
    this.source = options.source;
    this.output = options.output;
  }
}

export type AcornParseError = {
  message: string;
  pos: number;
  loc: Location;
};

export type SyntaxErrorInfo = {
  source: string;
  output?: string;
  reason: string;
  code: string;
};

export type SyntaxErrorKey = keyof SyntaxErrorInfo;

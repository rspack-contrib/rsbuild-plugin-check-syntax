import color from 'picocolors';
import { logger } from 'rslog';

import type {
  ECMASyntaxError,
  EcmaVersion,
  SyntaxErrorInfo,
  SyntaxErrorKey,
} from './types.js';

export function printErrors(
  errors: ECMASyntaxError[],
  ecmaVersion: EcmaVersion,
  excludeErrorLogs: SyntaxErrorKey[],
): void {
  if (errors.length === 0) {
    logger.success('[@rsbuild/plugin-check-syntax] Syntax check passed.');
    return;
  }

  const errs: SyntaxErrorInfo[] = errors.map((error) => ({
    source: `${error.source.path}:${error.source.line}:${error.source.column}`,
    output: error.output
      ? `${error.output.path}:${error.output.line}:${error.output.column}`
      : undefined,
    reason: error.message,
    code: error.source.code,
  }));

  const longest = Math.max(...Object.keys(errs[0]).map((err) => err.length));

  const expectedVersion = color.yellow(`ecmaVersion <= ${ecmaVersion}`);
  logger.error(
    `[@rsbuild/plugin-check-syntax] Find some syntax that does not match "${expectedVersion}":\n`,
  );

  errs.forEach((err, index) => {
    console.log(color.bold(color.red(`  ERROR ${index + 1}`)));
    printMain(err, longest, excludeErrorLogs);
  });

  throw new Error(
    `[@rsbuild/plugin-check-syntax] The current build fails due to an incompatible syntax, which can be fixed in the following ways:

  - If you want to downgrade the syntax, you can compile the specified module through the \`source.include\` config.
  - If you don't want to downgrade the syntax, you can adjust the project's browserslist to match the syntax, or set the \`ecmaVersion\` option.
  - If you don't want to check the syntax of specified files, you can use the \`exclude\` option to exclude the files to be checked.\n`,
  );
}

function printMain(
  error: SyntaxErrorInfo,
  longest: number,
  excludeErrorLogs: SyntaxErrorKey[],
) {
  const fillWhiteSpace = (s: string, longest: number) => {
    if (s.length < longest) {
      const rightPadding = ' '.repeat(longest - s.length);
      return s + rightPadding;
    }
    return s;
  };

  for (const [key, content] of Object.entries(error)) {
    if (!content || excludeErrorLogs.includes(key as SyntaxErrorKey)) {
      continue;
    }
    const title = color.magenta(`${fillWhiteSpace(`${key}:`, longest + 1)}`);
    console.info(`  ${title}  ${content}`);
  }

  console.info('');
}

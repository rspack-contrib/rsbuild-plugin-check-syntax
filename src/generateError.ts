import fs from 'node:fs';
import color from 'picocolors';
import { SourceMapConsumer } from 'source-map';
import {
  type AcornParseError,
  type CheckSyntaxExclude,
  ECMASyntaxError,
} from './types.js';
import { checkIsExclude } from './utils.js';

export function displayCodePointer(code: string, pos: number) {
  const SUB_LEN = 80;
  const start = Math.max(pos - SUB_LEN / 2, 0);
  const subCode = code.slice(start, start + SUB_LEN);
  const arrowPos = pos - start;
  const arrowLine = color.yellow('^'.padStart(arrowPos + 11, ' '));
  return `${subCode}\n${arrowLine}`;
}

export async function generateError({
  err,
  code,
  filepath,
  rootPath,
  exclude,
}: {
  err: AcornParseError;
  code: string;
  filepath: string;
  rootPath: string;
  exclude?: CheckSyntaxExclude;
}): Promise<ECMASyntaxError | null> {
  let error = await tryGenerateErrorFromSourceMap({
    err,
    code,
    filepath,
    rootPath,
  });

  if (!error) {
    const path = filepath.replace(rootPath, '');
    error = new ECMASyntaxError(err.message, {
      source: {
        path,
        line: err.loc.line,
        column: err.loc.column,
        code: displayCodePointer(code, err.pos),
      },
    });
  }

  if (checkIsExclude(error.source.path, exclude)) {
    return null;
  }

  return error;
}

export function makeCodeFrame(lines: string[], highlightIndex: number) {
  const startLine = Math.max(highlightIndex - 3, 0);
  const endLine = Math.min(highlightIndex + 4, lines.length - 1);
  const ret: string[] = [];

  for (let i = startLine; i < endLine; i++) {
    if (i === highlightIndex) {
      const lineNumber = `> ${i + 1}`.padStart(6, ' ');
      ret.push(color.yellow(`${lineNumber} | ${lines[i]}`));
    } else {
      const lineNumber = ` ${i + 1}`.padStart(6, ' ');
      ret.push(color.gray(`${lineNumber} | ${lines[i]}`));
    }
  }

  return `\n${ret.join('\n')}`;
}

async function tryGenerateErrorFromSourceMap({
  err,
  code,
  filepath,
  rootPath,
}: {
  err: AcornParseError;
  code: string;
  filepath: string;
  rootPath: string;
}): Promise<ECMASyntaxError | null> {
  const sourceMapPath = `${filepath}.map`;

  if (!fs.existsSync(sourceMapPath)) {
    return null;
  }

  try {
    const sourcemap = await fs.promises.readFile(sourceMapPath, 'utf-8');
    const consumer = await new SourceMapConsumer(sourcemap);
    const mappedPosition = consumer.originalPositionFor({
      line: err.loc.line,
      column: err.loc.column,
    });

    if (!mappedPosition.source) {
      return null;
    }

    const { sources } = consumer;
    const sourceIndex = sources.indexOf(mappedPosition.source);
    const sourceContent: string | null =
      JSON.parse(sourcemap).sourcesContent?.[sourceIndex];
    const sourcePath = mappedPosition.source.replace(/webpack:\/\/(tmp)?/g, '');
    const relativeFilepath = filepath.replace(rootPath, '');

    if (!sourceContent) {
      return new ECMASyntaxError(err.message, {
        source: {
          path: sourcePath,
          line: mappedPosition.line ?? 0,
          column: mappedPosition.column ?? 0,
          code: displayCodePointer(code, err.pos),
        },
        output: {
          path: relativeFilepath,
          line: err.loc.line,
          column: err.loc.column,
        },
      });
    }

    const rawLines = sourceContent.split(/\r?\n/g);
    const highlightLine = (mappedPosition.line ?? 1) - 1;

    return new ECMASyntaxError(err.message, {
      source: {
        path: sourcePath,
        line: mappedPosition.line ?? 0,
        column: mappedPosition.column ?? 0,
        code: makeCodeFrame(rawLines, highlightLine),
      },
      output: {
        path: relativeFilepath,
        line: err.loc.line,
        column: err.loc.column,
      },
    });
  } catch (e) {
    return null;
  }
}

import * as childProcess from 'child_process';

interface ExecOptions {
  cwd?: string;
  stdin?: string | Buffer;
}

interface ExecResult {
  code: number;
  out: Buffer;
}

/**
 * Executes the given command (and its string arguments) via the shell with some
 * limited options.
 *
 * Always logs STDERR (itself via STDERR), returns STDOUT and the status code.
 *
 * @param args
 * @param options
 */
export function exec(
  args: string[],
  options: ExecOptions = {},
): Promise<ExecResult> {
  const { cwd = process.cwd(), stdin } = options;

  args = args.slice();
  const command = args.shift();
  if (!command) {
    throw new TypeError(`no command specified`);
  }
  return new Promise((resolve) => {
    const ls = childProcess.spawn(command, args, {
      cwd,
      shell: true,
    });

    if (stdin !== undefined) {
      ls.stdin.write(stdin);
      ls.stdin.end();
    }

    const chunks: any[] = [];
    ls.stdout.on('data', (data) => chunks.push(data));
    ls.stderr.on('data', (data) => process.stderr.write(data));

    ls.on('close', (code) => {
      const out = Buffer.concat(chunks);
      return resolve({ code: code ?? 0, out });
    });
  });
}

import cliProgress from 'cli-progress';

import { createThrottle } from './threads.js';

export const createTqdmStepper = (total: number) => {
  let progress = 0;
  const throttle = createThrottle(50);
  const bar = new cliProgress.SingleBar(
    {
      format: ' {bar} {percentage}% | ETA: {eta}s | {value}/{total}',
    },
    cliProgress.Presets.shades_classic,
  );
  bar.start(total, progress, { eta: 0 });

  return () => {
    progress++;
    if (progress === total) {
      bar.stop();
      return;
    }
    if (throttle()) {
      bar.update(progress, { eta: (bar as any).eta });
    }
  };
};

export const createTqdm = (total: number) => {
  const stepper = createTqdmStepper(total);

  return <T, A extends any[]>(cb: (...args: A) => T) => {
    return (...args: A): T => {
      const res = cb(...args);
      if (res instanceof Promise) {
        return new Promise((resolve, reject) => {
          res
            .then((x) => {
              stepper();
              resolve(x);
            })
            .catch(reject);
        }) as any;
      }
      stepper();
      return res;
    };
  };
};

export function* tqdm<T>(arr: T[]): Iterable<T> {
  const stepper = createTqdmStepper(arr.length);

  for (let i = 0; i < arr.length; i++) {
    yield arr[i];
    stepper();
  }
}

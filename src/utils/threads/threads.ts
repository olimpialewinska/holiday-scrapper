import { cpus } from 'os';
import pLimit from 'p-limit';

export const getDefaultThreadsCount = () => {
  return cpus().length + 4;
};

export const limitedArrayMap = async <T, U>(
  array: T[],
  fn: (item: T, index: number) => Promise<U>,
  threads?: number,
): Promise<U[]> => {
  if (threads === undefined) threads = getDefaultThreadsCount();

  const limit = pLimit(threads);

  return Promise.all(
    array.map(
      async (entry, i) =>
        await limit(async () => {
          return await fn(entry, i);
        }),
    ),
  );
};

export const createThrottle = (time: number) => {
  let last = 0;
  return () => {
    if (last + time < performance.now()) {
      last = performance.now();
      return true;
    }
    return false;
  };
};

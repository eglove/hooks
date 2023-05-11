import { useEffect } from 'react';
export type IntervalCallback = (time: number | undefined) => void;

export const animationInterval = (
  ms: number,
  signal: AbortSignal,
  callback: IntervalCallback,
): void => {
  const start =
    document.timeline === undefined
      ? performance.now()
      : document.timeline.currentTime;

  const frame = (time: number): void => {
    if (signal.aborted) {
      return;
    }

    callback(time);
    scheduleFrame(time);
  };

  const scheduleFrame = (time: number | undefined): void => {
    if (time !== undefined && start !== null) {
      const elapsed = time - start;
      const roundedElapsed = Math.round(elapsed / ms) * ms;
      const targetNext = start + roundedElapsed + ms;
      const delay = targetNext - performance.now();
      setTimeout(() => {
        return requestAnimationFrame(frame);
      }, delay);
    }
  };

  scheduleFrame(start ?? 0);
};

export const useAnimationInterval = (
  ms: number,
  callback: IntervalCallback,
): void => {
  useEffect(() => {
    const controller = new AbortController();

    animationInterval(ms, controller.signal, callback);

    return (): void => {
      controller.abort();
    };
  }, [callback, ms]);
};

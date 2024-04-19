import { useEffect, useState } from "react";

import { animationInterval } from "./use-animation-interval.ts";

type UseCopyClipboardReturn = {
  copyToClipboard: (text: string) => void;
  error?: Error;
  isCopied: boolean;
};

const DEFAULT_DURATION = 2000;

export const useCopyClipboard = (
  successDuration = DEFAULT_DURATION,
): UseCopyClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<Error>();

  const copyToClipboard = (text: string): void => {
    const asyncCopy = async (): Promise<void> => {
      try {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
      } catch (writeTextError: unknown) {
        if (error instanceof Error) {
          setError(writeTextError as Error);
        }

        setIsCopied(false);
      }
    };

    asyncCopy().catch((asyncError: unknown) => {
      if (asyncError instanceof Error) {
        setError(asyncError);
      }
      setIsCopied(false);
    });
  };

  useEffect(() => {
    const controller = new AbortController();

    if (isCopied) {
      animationInterval(successDuration, controller.signal, () => {
        setIsCopied(false);
      });
    }

    return (): void => {
      controller.abort();
    };
  }, [isCopied, successDuration]);

  return { copyToClipboard, error, isCopied };
};

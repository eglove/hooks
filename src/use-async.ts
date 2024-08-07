import { useEffect, useState } from "react";

export function useAsync<T, E> (callback: () => Promise<T>) {
  const [result, setResult] = useState<T>();
  const [error, setError] = useState<E>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    callback()
      .then((result_) => {
        setResult(result_);
      })
      .catch((error_: unknown) => {
        setError(error_ as E);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    error,
    isLoading,
    result,
  };
}

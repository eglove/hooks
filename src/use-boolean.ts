import { useCallback, useState } from "react";

export const useBoolean = (initialValue?: boolean) => {
  const [value, setValue] = useState<boolean>(initialValue ?? false);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  const toggle = useCallback(() => {
    setValue((value_) => {
      return !value_;
    });
  }, []);

  return { setFalse, setTrue, setValue, toggle, value };
};

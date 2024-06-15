import { useState } from "react";

type LocalStorageType<ValueType> = string | undefined | ValueType;

export const useLocalStorage = <ValueType>(
  keyName: string,
  defaultValue?: ValueType,
  deserialize = JSON.parse,
  serialize = JSON.stringify,
  // eslint-disable-next-line @typescript-eslint/max-params
): [LocalStorageType<ValueType>, (value: ValueType) => void, () => void] => {
  const [storedValue, setStoredValue] = useState<LocalStorageType<ValueType>>(
    () => {
      const value = globalThis.localStorage.getItem(keyName);

      if (null !== value) {
        try {
          return deserialize(value) as ValueType;
        } catch {
          return value;
        }
      }

      if (defaultValue !== undefined) {
        globalThis.localStorage.setItem(keyName, serialize(defaultValue));
      }

      return defaultValue;
    },
  );

  const setValue = (value: ValueType): void => {
    if ("string" === typeof value) {
      globalThis.localStorage.setItem(keyName, value);
    } else {
      try {
        globalThis.localStorage.setItem(keyName, serialize(value));
      } catch {
        throw new Error(`Failed to set ${keyName} in local storage.`);
      }
    }

    setStoredValue(value);
  };

  const removeValue = (): void => {
    globalThis.localStorage.removeItem(keyName);
  };

  return [storedValue, setValue, removeValue];
};

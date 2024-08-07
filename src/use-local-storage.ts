import isNil from "lodash/isNil.js";
import { useSyncExternalStore } from "react";

type ListenerParameters = Parameters<typeof addEventListener>;
type ListenerOptions = AddEventListenerOptions | EventListenerOptions;

type LocalStorageStoreOptions = {
  defaultValue?: string;
  listenerOptions?: ListenerOptions;
};

function localStorageStore (key: string, options?: LocalStorageStoreOptions) {
  return {
    event: new Event(`useLocalStorage-${key}`),
    getServerSnapshot: () => {
      return options?.defaultValue ?? null;
    },
    getSnapshot: () => {
      return localStorage.getItem(key);
    },
    subscribe: (listener: ListenerParameters[1]) => {
      const controller = new AbortController();
      const { signal } = controller;

      addEventListener(`useLocalStorage-${key}`, listener, {
        signal,
        ...options?.listenerOptions,
      });

      return () => {
        controller.abort();
      };
    },
  };
}

type UseLocalStorageProperties = {
  defaultValue?: string;
  listenerOptions?: ListenerOptions;
};

export function useLocalStorage (
  key: string,
  options?: UseLocalStorageProperties,
) {
  const { event, getServerSnapshot, getSnapshot, subscribe } =
    localStorageStore(key, {
      defaultValue: options?.defaultValue,
      listenerOptions: options?.listenerOptions,
    });

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = (newValue: string) => {
    localStorage.setItem(key, newValue);
    dispatchEvent(event);
  };

  if (null === value && !isNil(options?.defaultValue)) {
    setValue(options.defaultValue);
  }

  return [value, setValue] as const;
}

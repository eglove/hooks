import isNil from "lodash/isNil.js";
import isObject from "lodash/isObject.js";
import keys from "lodash/keys.js";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector.js";

export const useStore = <State, Selection>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => State,
  getServerSnapshot: () => State,
  selector: (state: State) => Selection,
  _shallow = shallow,
): Selection => {
  return useSyncExternalStoreWithSelector(
    subscribe,
    getSnapshot,
    getServerSnapshot,
    selector,
    _shallow,
  );
};

const shallow = <T>(objectA: T, objectB: T) => {
  if (Object.is(objectA, objectB)) {
    return true;
  }

  if (
    !isObject(objectA) ||
    isNil(objectA) ||
    !isObject(objectB) ||
    isNil(objectB)
  ) {
    return false;
  }

  const keysA = keys(objectA);
  if (keysA.length !== keys(objectB).length) {
    return false;
  }

  for (const keyA of keysA) {
    if (
      !Object.hasOwn(objectB, keyA) ||
      !Object.is(objectA[keyA as keyof T], objectB[keyA as keyof T])
    ) {
      return false;
    }
  }
  return true;
};

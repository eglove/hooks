import type { Get, Join, Paths, Split } from "type-fest";

import { propertiesIsEqual } from "@ethang/toolbelt/object/properties-is-equal.js";
import entries from "lodash/entries.js";
import get from "lodash/get.js";
import values from "lodash/values.js";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector.js";

export const useStore = <
  State,
  // @ts-expect-error this works, will infer number keys to string
  Selector extends Record<string, Readonly<Split<Paths<State>, ".">>>,
>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => State,
  getServerSnapshot: () => State,
  selector: Selector,
) => {
  return useSyncExternalStoreWithSelector(
    subscribe,
    getSnapshot,
    getServerSnapshot,
    (state) => {
      const value = {} as { [K in keyof Selector]: Get<State, Join<Selector[K], ".">> };

      for (const [key, path] of entries(selector)) {
        value[key as keyof Selector] = get(state, path) as Get<State, Join<typeof path, ".">>;
      }

      return value as { [K in keyof Selector]: Get<State, Join<Selector[K], ".">> };
    },
    (a, b) => {
      // @ts-expect-error this works, will infer number keys to string
      return propertiesIsEqual(a, b, values(selector));
    },
  );
};

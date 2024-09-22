import type { Get, Join, Paths, Split } from "type-fest";

import { propertiesIsEqual } from "@ethang/toolbelt/object/properties-is-equal.js";
import entries from "lodash/entries.js";
import get from "lodash/get.js";
import values from "lodash/values.js";
import { useSyncExternalStoreWithSelector } from "use-sync-external-store/shim/with-selector.js";

// @ts-expect-error this works, will infer number keys to string
type Selector<State,> = Record<string, Readonly<Split<Paths<State>, ".">>>;

export const useStore = <
  State,
>(
  subscribe: (onStoreChange: () => void) => () => void,
  getSnapshot: () => State,
  getServerSnapshot: () => State,
  selector: Selector<State>,
) => {
  return useSyncExternalStoreWithSelector(
    subscribe,
    getSnapshot,
    getServerSnapshot,
    (state) => {
      const value = {} as { [K in keyof Selector<State>]: Get<State, Join<Selector<State>[K], ".">> };

      for (const [key, path] of entries(selector)) {
        value[key] = get(state, path) as Get<State, Join<typeof path, ".">>;
      }

      return value as { [K in keyof Selector<State>]: Get<State, Join<Selector<State>[K], ".">> };
    },
    (a, b) => {
      let isEqual = true;
      for (const value of values(selector)) {
        // @ts-expect-error this works, will infer number keys to string
        isEqual = propertiesIsEqual(a, b, value);
      }

      return isEqual;
    },
  );
};

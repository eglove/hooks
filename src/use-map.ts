import { useState } from 'react';

export function useMap<T, U>(
  values?: Array<[T, U]> | undefined | null,
): Map<T, U> {
  const [map, setMap] = useState(new Map(values));

  // eslint-disable-next-line functional/immutable-data
  map.set = (key: T, value: U): Map<T, U> => {
    const map_ = new Map(map);
    const returnValue = map_.set(key, value);

    setMap(map_);
    return returnValue;
  };

  // eslint-disable-next-line functional/immutable-data
  map.delete = (key: T): boolean => {
    const map_ = new Map(map);
    const returnValue = map_.delete(key);

    setMap(map_);
    return returnValue;
  };

  // eslint-disable-next-line functional/immutable-data
  map.clear = (): void => {
    const map_ = new Map(map);
    map_.clear();

    setMap(map_);
  };

  return map;
}

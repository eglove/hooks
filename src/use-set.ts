import { useState } from 'react';

export function useSet<SetType>(
  values?: SetType[] | undefined | null,
): Set<SetType> {
  const [set, setSet] = useState(new Set(values));

  // eslint-disable-next-line functional/immutable-data
  set.add = (value: SetType): Set<SetType> => {
    const set_ = new Set(set);
    const returnValue = set_.add(value);

    setSet(set_);

    return returnValue;
  };

  // eslint-disable-next-line functional/immutable-data
  set.delete = (value: SetType): boolean => {
    const set_ = new Set(set);
    const returnValue = set_.delete(value);

    setSet(set_);

    return returnValue;
  };

  // eslint-disable-next-line functional/immutable-data
  set.clear = (): void => {
    const set_ = new Set(set);
    set_.clear();

    setSet(set_);
  };

  return set;
}

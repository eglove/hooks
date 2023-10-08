import { useState } from 'react';

type UseSet<SetType> = Omit<Set<SetType>, 'add' | 'delete'>;

type UseSetReturn<SetType> = {
  add: (value: SetType) => void;
  remove: (value: SetType) => void;
  set: UseSet<SetType>;
};

export function useSet<SetType>(
  values?: SetType[] | undefined | null,
): UseSetReturn<SetType> {
  const [set, setSet] = useState(new Set(values));

  const add = (value: SetType): void => {
    setSet(set_ => {
      return set_.add(value);
    });
  };

  const remove = (value: SetType): void => {
    setSet(set_ => {
      set_.delete(value);
      return new Set(set_);
    });
  };

  return { add, remove, set };
}

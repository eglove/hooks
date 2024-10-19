import entries from "lodash/entries.js";
import isError from "lodash/isError.js";
import isNil from "lodash/isNil.js";
import isString from "lodash/isString.js";
import keys from "lodash/keys.js";
import map from "lodash/map.js";
import { type ChangeEvent, type Dispatch, type FormEvent, type SetStateAction, useCallback, useState } from "react";
import { type z, ZodError } from "zod";

export type FieldErrors<StateType,> =
  | Record<keyof StateType, null | string[] | undefined>
  | undefined;

export type UseFormProperties<StateType,> = {
  onChange?: (event: ChangeEvent) => unknown;
  onError?: (error: unknown) => unknown;
  onFieldError?: (error: FieldErrors<StateType>) => unknown;
  onSubmit?: (...arguments_: unknown[]) => unknown;
  zodValidator?: z.ZodTypeAny;
};

export type UseFormReturn<StateType,> = {
  clearFieldErrors: () => void;
  clearForm: () => void;
  fieldErrors: FieldErrors<StateType>;
  formError: string | undefined;
  formState: StateType;
  handleChange: (event: ChangeEvent) => void;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
  resetForm: () => void;
  setFieldErrors: Dispatch<SetStateAction<FieldErrors<StateType>>>;
  setFormError: Dispatch<SetStateAction<string | undefined>>;
  setFormState: Dispatch<SetStateAction<StateType>>;
  setValue: (key: keyof StateType) => (value: StateType[typeof key]) => void;
  validate: () => boolean;
};

const setAll = <ObjectType extends Record<string, unknown>,>(
  object: ObjectType,
  value?: unknown,
): ObjectType => {
  return Object.fromEntries(
    map(entries(object), ([key]) => {
      return [key, value];
    }),
  ) as unknown as ObjectType;
};

export const useForm = <StateType extends Record<string, unknown>,>(
  initialState: StateType,
  properties?: UseFormProperties<StateType>,
): UseFormReturn<StateType> => {
  const [formState, setFormState] = useState(() => {
    const defaultState: Record<string, unknown> = {};
    for (const key of keys(initialState)) {
      defaultState[key] =
        initialState[key] === undefined
          ? ""
          : initialState[key];
    }

    return defaultState as StateType;
  });
  const [formError, setFormError] = useState<string>();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<StateType>>();

  const clearFieldErrors = useCallback((): void => {
    if (fieldErrors !== undefined) {
      setFieldErrors(setAll(fieldErrors, null));
    }
  }, [fieldErrors]);

  const clearForm = useCallback((): void => {
    setFormState(setAll(formState, ""));
  }, [formState]);

  const resetForm = useCallback((): void => {
    setFormState(initialState);
  }, [initialState]);

  const handleChange = useCallback(
    (event: ChangeEvent): void => {
      const eventTarget = event.target as unknown as {
        checked?: boolean;
        files: File[];
        name: string;
        type: string;
        value: boolean | File | number | string;
      };

      let { value } = eventTarget;
      const { checked, files, name, type } = eventTarget;

      if ("checkbox" === type && checked !== undefined) {
        value = checked;
      }

      if ("number" === type && isString(value)) {
        value = Number.parseFloat(value.replaceAll(",", ""));
      }

      if ("file" === type) {
        [value] = files;
      }

      setFormState((_formState) => {
        return {
          ..._formState,
          [name]: value,
        };
      });

      properties?.onChange?.(event);
    },
    [properties],
  );

  const validate = useCallback(() => {
    if (!isNil(properties?.zodValidator)) {
      const result = properties.zodValidator.safeParse(formState);

      if (!result.success && result.error instanceof ZodError) {
        const errors = (result
          .error.formErrors.fieldErrors) as typeof fieldErrors;
        setFieldErrors(errors);
        properties.onFieldError?.(errors);
        return false;
      }
    }

    return true;
  }, [formState, properties]);

  const handleSubmit = useCallback(
    (event: FormEvent): void => {
      event.preventDefault();

      const validation = validate();
      if (!validation) {
        return;
      }

      if (properties?.onSubmit === undefined) {
        return;
      }

      let hasException = false;
      try {
        properties.onSubmit();
      } catch (error: unknown) {
        hasException = true;
        properties.onError?.(error);

        if (isError(error)) {
          setFormError(error.message);
        }
      }

      if (!hasException) {
        clearFieldErrors();
        setFormError("");
      }
    },
    [clearFieldErrors, properties, validate],
  );

  const setValue = useCallback((key: keyof StateType) => {
    return (value: StateType[typeof key]) => {
      setFormState((previousState) => {
        return {
          ...previousState,
          [key]: value,
        };
      });
    };
  }, []);

  return {
    clearFieldErrors,
    clearForm,
    fieldErrors,
    formError,
    formState,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldErrors,
    setFormError,
    setFormState,
    setValue,
    validate,
  };
};

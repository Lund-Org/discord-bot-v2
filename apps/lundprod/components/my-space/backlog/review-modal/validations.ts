import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useValidateMin = (min: number) => {
  const { t } = useTranslation();

  return useCallback(
    (value: number) => {
      return value < min ? t('validation.min', { min }) : undefined;
    },
    [t],
  );
};

export const useValidateMax = (max: number) => {
  const { t } = useTranslation();

  return useCallback(
    (value: number) => {
      return value > max ? t('validation.max', { max }) : undefined;
    },
    [t],
  );
};

export const useLength = (min: number, max: number) => {
  const { t } = useTranslation();

  return useCallback(
    (value: string) => {
      return value.length > max || value.length < min
        ? t('validation.length', { min, max })
        : undefined;
    },
    [t],
  );
};

export const pipeValidators = <ValueType = string>(
  ...validators: Array<(value: ValueType) => string | undefined>
) => {
  return (...args: Parameters<(value: ValueType) => string | undefined>) => {
    for (const validator of validators) {
      const err = validator(...args);

      if (err) {
        return err;
      }
    }
  };
};

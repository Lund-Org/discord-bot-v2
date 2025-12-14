import { FormHelperText } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export const CharactersLeft = ({
  str,
  lengthMax,
}: {
  str: string;
  lengthMax: number;
}) => {
  const { t } = useTranslation();
  return (
    <FormHelperText color={str.length > lengthMax ? 'red.600' : 'inherit'}>
      {t('charactersLeft', {
        count: lengthMax - str.length,
      })}
    </FormHelperText>
  );
};

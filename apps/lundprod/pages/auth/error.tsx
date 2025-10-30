import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { signIn } from 'next-auth/react';
import { useTranslation } from 'react-i18next';

import { getErrorMessage } from '~/lundprod/utils/auth';
import { getParam } from '~/lundprod/utils/next';

type ErrorProps = {
  error: string;
};

export const getServerSideProps: GetServerSideProps<ErrorProps> = async ({
  query,
}) => {
  return {
    props: { error: getParam(query.error) },
  };
};

export default function Error({ error }: ErrorProps) {
  const { t } = useTranslation();
  const errorMessage = getErrorMessage(t, error);

  return (
    <Flex
      flexDirection="column"
      maxW="500px"
      border="1px solid var(--chakra-colors-gray-600)"
      mt="70px"
      gap="50px"
      p="20px"
      mx="auto"
      borderRadius={10}
      textAlign="center"
      _hover={{
        border: '1px solid var(--chakra-colors-gray-500)',
      }}
    >
      <Heading variant="h2">{t('auth.authError')}</Heading>
      <Box>
        {errorMessage.split('\n').map((errorMsg, index) => (
          <Text color="red.400" key={index}>
            {errorMsg}
          </Text>
        ))}
      </Box>
      <Button
        colorScheme="orange"
        variant="outline"
        onClick={() => signIn('credentials', { callbackUrl: '/' })}
      >
        {t('auth.errorMessage.back')}
      </Button>
    </Flex>
  );
}

import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { GetServerSideProps } from 'next';
import { signIn } from 'next-auth/react';
import { getErrorMessage } from '~/lundprod/utils/auth';
import { getParam } from '~/lundprod/utils/next';

type ErrorMessage = {
  errorMessage: string;
};

export const getServerSideProps: GetServerSideProps<ErrorMessage> = async ({
  query,
}) => {
  const errorMessage = getErrorMessage(getParam(query.error));
  return {
    props: { errorMessage },
  };
};

export default function Error({ errorMessage }: ErrorMessage) {
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
      <Heading variant="h2">Erreur d&apos;authentification</Heading>
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
        Retour
      </Button>
    </Flex>
  );
}

import { Box, Button, Image, Text } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { getProviders, signIn } from 'next-auth/react';

import { LightStyledLink } from '~/lundprod/components/styled-link';
import { networks } from '~/lundprod/utils/url';

type Providers = Awaited<ReturnType<typeof getProviders>>;

type SignInProps = {
  providers: Providers;
};

export const getServerSideProps: GetServerSideProps<SignInProps> = async () => {
  const providers = await getProviders();

  return {
    props: { providers },
  };
};

const Fieldset = styled.fieldset(() => ({
  margin: 'auto',
  padding: '30px',
  border: '1px solid var(--chakra-colors-gray-400)',
  borderRadius: '10px',
}));

const Legend = styled.legend(() => ({
  paddingLeft: '20px',
  paddingRight: '20px',
  fontWeight: 600,
}));

export default function SignIn({ providers }: SignInProps) {
  const { query } = useRouter();
  const discordNetwork = networks.find(
    (network) => network.title === 'Discord'
  );

  return (
    <Box maxW="500px" mx="auto" mt="50px">
      <Fieldset>
        <Legend>Connexion</Legend>
        {Object.values(providers).map((provider) => (
          <Box key={provider.name}>
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={() => signIn(provider.id, { callbackUrl: '/' })}
              display="flex"
              color="#7289da"
              margin="auto"
            >
              <Image
                src={discordNetwork.imgSrc}
                alt="Discord"
                w="20px"
                mr="10px"
              />
              <Text as="span">Connexion avec {provider.name}</Text>
            </Button>
          </Box>
        ))}
      </Fieldset>
      <Box mt="50px" textAlign="center">
        <Text as="span">
          Pour s&apos;inscrire, il faut pour l&apos;instant rejoindre le&nbsp;
        </Text>
        <LightStyledLink
          href={discordNetwork.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {discordNetwork.title}
        </LightStyledLink>
        {query.error && (
          <Text color="red.400" mt="20px">
            Erreur : {query.error}
          </Text>
        )}
      </Box>
    </Box>
  );
}

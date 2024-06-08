import { Box, Divider, Grid } from '@chakra-ui/react';

import { BotPresentation } from '../components/home/bot-presentation';
import { GachaPresentation } from '../components/home/gacha-presentation';
import { SocialNetworkCard } from '../components/home/social-network-card';
import { WebsitePresentation } from '../components/home/website-presentation';
import { Welcome } from '../components/home/welcome';
import { OtherProjectsPresentation } from '../components/home/other-projects-presentation';
import { networks } from '../utils/url';

export function Index() {
  return (
    <Box>
      <Box maxW="1200px" p="30px" m="auto">
        <Welcome />
        <Divider my={20} />
        <Grid
          templateColumns={{ base: 'repeat(3, 1fr)', md: 'repeat(5, 1fr)' }}
          gridAutoRows="auto"
          gridGap={4}
          w="fit-content"
          mx="auto"
        >
          {networks.map((network, index) => (
            <SocialNetworkCard key={index} {...network} />
          ))}
        </Grid>
      </Box>
      <GachaPresentation />
      <BotPresentation />
      <WebsitePresentation />
      <OtherProjectsPresentation />
    </Box>
  );
}

export default Index;

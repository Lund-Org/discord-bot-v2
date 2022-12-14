import { Box, Divider, Grid } from '@chakra-ui/react';
import {
  socialDiscord,
  socialTwitch,
  socialTwitter,
  socialYoutube,
} from '../assets';
import { GachaPresentation } from '../components/home/gacha-presentation';
import { WebsitePresentation } from '../components/home/website-presentation';
import { SocialNetworkCard } from '../components/home/social-network-card';
import { Welcome } from '../components/home/welcome';
import { BotPresentation } from '../components/home/bot-presentation';
import { ComingProjects } from '../components/home/coming-projects';
import { Footer } from '../components/home/footer';

const networks = [
  {
    imgSrc: socialDiscord.src,
    title: 'Discord',
    url: 'https://discord.gg/gJyu9p2',
  },
  {
    imgSrc: socialTwitch.src,
    title: 'Twitch',
    url: 'https://www.twitch.tv/lundprod',
  },
  {
    imgSrc: socialTwitter.src,
    title: 'Twitter',
    url: 'https://twitter.com/LundProd',
  },
  {
    imgSrc: socialYoutube.src,
    title: 'Youtube',
    url: 'https://youtube.com/c/lundprod',
  },
];

export function Index() {
  return (
    <Box>
      <Box maxW="1200px" p="30px" m="auto">
        <Welcome />
        <Divider my={20} />
        <Grid
          templateColumns={{ base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
          gridAutoRows="auto"
          gridGap={4}
        >
          {networks.map((network, index) => (
            <SocialNetworkCard key={index} {...network} />
          ))}
        </Grid>
      </Box>
      <GachaPresentation />
      <BotPresentation />
      <WebsitePresentation />
      <Box maxW="1200px" p="30px 30px 80px 30px" m="auto">
        <ComingProjects />
      </Box>
      <Footer />
    </Box>
  );
}

export default Index;

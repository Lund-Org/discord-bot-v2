import {
  AspectRatio,
  Box,
  Button,
  Collapse,
  Divider,
  Flex,
  Heading,
  useBoolean,
} from '@chakra-ui/react';
import { prisma } from '@discord-bot-v2/prisma';
import { useTranslation } from 'react-i18next';
import { GetStaticProps } from 'next';

import { BotPresentation } from '../components/home/bot-presentation';
import { GachaPresentation } from '../components/home/gacha-presentation';
import { WebsitePresentation } from '../components/home/website-presentation';
import { Welcome } from '../components/home/welcome';
import { OtherProjectsPresentation } from '../components/home/other-projects-presentation';

type IndexProps = {
  lundprodEmbedUrl: string;
  lundprodGamedevEmbedUrl: string;
};

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const configLundProdVideo = await prisma.config.findUnique({
    where: { name: 'LAST_LUNDPROD_VIDEO' },
  });
  const configLundProdGamedevVideo = await prisma.config.findUnique({
    where: { name: 'LAST_LUNDPRODGAMEDEV_VIDEO' },
  });

  return {
    revalidate: 3600,
    props: {
      lundprodEmbedUrl:
        (configLundProdVideo?.value as { embedUrl?: string })?.embedUrl || '',
      lundprodGamedevEmbedUrl:
        (configLundProdGamedevVideo?.value as { embedUrl?: string })
          ?.embedUrl || '',
    },
  };
};

export function Index({
  lundprodEmbedUrl,
  lundprodGamedevEmbedUrl,
}: IndexProps) {
  const { t } = useTranslation();
  const [isLundprodVideoOpen, setLundprodVideoOpen] = useBoolean(true);
  const [isLundprodGamedevVideoOpen, setLundprodGamedevVideoOpen] =
    useBoolean(false);

  const toggleLundprodVideo = () => {
    setLundprodVideoOpen.toggle();
    if (!isLundprodVideoOpen && isLundprodGamedevVideoOpen) {
      setLundprodGamedevVideoOpen.off();
    }
  };
  const toggleLundprodGamedevVideo = () => {
    setLundprodGamedevVideoOpen.toggle();
    if (isLundprodVideoOpen && !isLundprodGamedevVideoOpen) {
      setLundprodVideoOpen.off();
    }
  };

  return (
    <Box>
      <Box maxW="1200px" p="30px" m="auto">
        <Welcome />
        <Divider mt={10} mb={5} />
        <Heading variant="h3" textAlign="center">
          {t('welcome.lastVideoTitle')}
        </Heading>
        <Flex mb={4} gap={10} w="fit-content" mx="auto">
          <Button onClick={toggleLundprodVideo} colorScheme="orange">
            {t('welcome.lastVideoLundprod')}
          </Button>
          <Button onClick={toggleLundprodGamedevVideo} colorScheme="purple">
            {t('welcome.lastVideoLundprodGamedev')}
          </Button>
        </Flex>
        <Collapse in={isLundprodVideoOpen}>
          <AspectRatio maxW="800px" mx="auto" ratio={16 / 9}>
            <iframe
              src={lundprodEmbedUrl}
              title="LundProd video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </AspectRatio>
        </Collapse>
        <Collapse in={isLundprodGamedevVideoOpen}>
          <AspectRatio maxW="800px" mx="auto" ratio={16 / 9}>
            <iframe
              src={lundprodGamedevEmbedUrl}
              title="LundProdGamedev video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </AspectRatio>
        </Collapse>
      </Box>
      <GachaPresentation />
      <BotPresentation />
      <WebsitePresentation />
      <OtherProjectsPresentation />
    </Box>
  );
}

export default Index;

import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Heading,
  Image,
  Text,
} from '@chakra-ui/react';
import { ReactNode } from 'react';

import {
  illustration3DModeling,
  illustrationVideoGame,
} from '~/lundprod/assets';

import { LightStyledLink } from '../styled-link';

const AccordionTitle = ({ children }: { children: string }) => (
  <Box as="span" flex="1" textAlign="left" color="gray.100" fontWeight="bold">
    {children}
  </Box>
);

type AccordionLineProps = {
  title: string;
  illustration: { src: string } | null;
  description: string | ReactNode;
};

const AccordionLine = ({
  title,
  illustration,
  description,
}: AccordionLineProps) => {
  return (
    <AccordionItem>
      <Heading>
        <AccordionButton _hover={{ bg: 'gray.900' }}>
          <AccordionTitle>{title}</AccordionTitle>
          <AccordionIcon />
        </AccordionButton>
      </Heading>
      <AccordionPanel pb={4}>
        {illustration && (
          <Image
            src={illustration.src}
            mb="10px"
            m="0 auto 30px auto"
            minW="400px"
            maxW="600px"
            alt={title}
          />
        )}
        <Text>{description}</Text>
      </AccordionPanel>
    </AccordionItem>
  );
};

export const ComingProjects = () => {
  return (
    <Box>
      <Heading color="orange.300" mb="40px">
        Projets à venir...
      </Heading>
      <Accordion
        allowToggle
        defaultIndex={0}
        maxW="800px"
        m="auto"
        textAlign="center"
        color="orange.500"
      >
        <AccordionLine
          title="Projets de jeux"
          illustration={illustrationVideoGame}
          description={
            <>
              <Text as="span">
                Création d&apos;un jeu, tactical RPG avec un gameplay proche de
                Dofus, mais en solo. Le jeu sera fait avec Godot, Blender pour
                générer les sprites. Pour plus d&apos;info :{' '}
              </Text>
              <LightStyledLink
                href="https://www.twitch.tv/videos/1960153338"
                target="_blank"
                rel="noreferrer noopener"
              >
                cliquez ici
              </LightStyledLink>
            </>
          }
        />
        <AccordionLine
          title="Projet 3D"
          illustration={illustration3DModeling}
          description="Continuer d'apprendre la 3D et se perfectionner."
        />
        <AccordionLine
          title="Autres"
          illustration={null}
          description="Seul l'avenir nous le dira..."
        />
      </Accordion>
    </Box>
  );
};

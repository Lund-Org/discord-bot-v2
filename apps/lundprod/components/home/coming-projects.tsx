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
import { illustration3DModeling, illustrationVideoGame } from '../../assets';

const AccordionTitle = ({ children }: { children: string }) => (
  <Box as="span" flex="1" textAlign="left" color="gray.100" fontWeight="bold">
    {children}
  </Box>
);

type AccordionLineProps = {
  title: string;
  illustration: { src: string } | null;
  description: string;
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
          title="Ride & Hide"
          illustration={illustrationVideoGame}
          description="Projet Unity de jeu mobile et PC. Il sera disponible gratuitement. Détails à venir..."
        />
        <AccordionLine
          title="Projet 3D"
          illustration={illustration3DModeling}
          description="Apprendre la 3D, pour pouvoir créer ses propres assets graphiques pour de futurs jeux vidéos."
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

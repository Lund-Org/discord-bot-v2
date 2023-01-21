import { StarIcon } from '@chakra-ui/icons';
import { Box, Flex, FlexProps, Image, Text } from '@chakra-ui/react';
import { CardType } from '@prisma/client';
import { useGachaHome } from '~/lundprod/contexts/gacha-home-context';
import { fusionIcon } from '~/lundprod/assets';
import { CardWithFusionDependencies } from '~/lundprod/utils/types';

type CardListElementProps = {
  card: CardType | CardWithFusionDependencies;
  label?: string;
} & FlexProps;

export const CardListElement = ({
  card,
  label,
  ...rest
}: CardListElementProps) => {
  const { selectCard } = useGachaHome();

  const onClick = () => {
    if (hasFusionDependencies(card)) {
      selectCard(card);
    }
  };

  return (
    <Flex
      key={card.id}
      alignItems="center"
      py="5px"
      cursor="pointer"
      onClick={onClick}
      {...rest}
    >
      <Box w={3} h={3} mr={2}>
        {!!card.isFusion && <Image src={fusionIcon.src} alt="Fusion" />}
      </Box>
      <Flex mr={2} alignItems="center" w="35px">
        {Array.from({ length: card.level }).map((_, index) => (
          <StarIcon
            key={index}
            w={2}
            h={2}
            color="gold"
            verticalAlign="unset"
          />
        ))}
      </Flex>
      <Text>{label || `#${card.id} - ${card.name}`}</Text>
    </Flex>
  );
};

function hasFusionDependencies(
  data: CardListElementProps['card']
): data is CardWithFusionDependencies {
  return 'fusionDependencies' in data;
}

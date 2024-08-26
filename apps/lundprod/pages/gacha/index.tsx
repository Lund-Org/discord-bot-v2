import { ChevronRightIcon, QuestionOutlineIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
import {
  CardXPConfig,
  ChancesConfig,
  GachaConfigEnum,
  PriceConfig,
  SellConfig,
} from '@discord-bot-v2/common';
import { prisma } from '@discord-bot-v2/prisma';
import { GetStaticProps } from 'next';
import { Trans, useTranslation } from 'react-i18next';

import { CommandTable } from '~/lundprod/components/gacha/home/command-table';
import { DiscordCTA } from '~/lundprod/components/gacha/home/discord-CTA';
import { LevelsTable } from '~/lundprod/components/gacha/home/levels-table';
import { LightStyledLink } from '~/lundprod/components/styled-link';

type GachaPageProps = {
  configSell: SellConfig;
  configPrice: PriceConfig;
  configDropChances: ChancesConfig;
  configCardXP: CardXPConfig;
  configLevels: Record<string, number>;
};

export const getStaticProps: GetStaticProps<GachaPageProps> = async () => {
  const configSell = (
    await prisma.config.findUnique({
      where: { name: GachaConfigEnum.SELL },
    })
  )?.value as SellConfig;
  const configPrice = (
    await prisma.config.findUnique({
      where: { name: GachaConfigEnum.PRICE },
    })
  )?.value as PriceConfig;
  const configDropChances = (
    await prisma.config.findUnique({
      where: { name: GachaConfigEnum.DROP_CHANCES },
    })
  )?.value as ChancesConfig;
  const configCardXP = (
    await prisma.config.findUnique({
      where: { name: GachaConfigEnum.CARD_XP },
    })
  )?.value as CardXPConfig;
  const configLevels = (
    await prisma.config.findUnique({
      where: { name: GachaConfigEnum.LEVELS },
    })
  )?.value as Record<string, number>;

  return {
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every hour
    revalidate: 3600, // In seconds
    // Passed to the page component as props
    props: {
      configSell,
      configPrice,
      configDropChances,
      configCardXP,
      configLevels,
    },
  };
};

export function GachaPage({
  configSell,
  configPrice,
  configDropChances,
  configCardXP,
  configLevels,
}: GachaPageProps) {
  const { t } = useTranslation();

  return (
    <Flex justifyContent="center">
      <Box maxW="1200px" p="30px" overflow="hidden">
        <Heading
          variant="h3"
          as="h3"
          pb="10px"
          mb="30px"
          borderBottom="1px solid var(--chakra-colors-orange-500)"
          maxW="400px"
        >
          {t('gacha.index.title')}
        </Heading>
        <Text mb="10px">{t('gacha.index.description1')}</Text>
        <Text mb="30px">{t('gacha.index.description2')}</Text>
        <Text mb="10px">
          <ChevronRightIcon mr="4px" />
          <Trans
            i18nKey="gacha.index.cardListLink"
            components={{
              lightLink: <LightStyledLink href="/gacha/list" />,
            }}
          />
        </Text>
        <Text mb="60px">
          <ChevronRightIcon mr="4px" />
          <Trans
            i18nKey="gacha.index.rankListLink"
            components={{
              lightLink: <LightStyledLink href="/gacha/ranking" />,
            }}
          />
        </Text>
        <Heading
          variant="h6"
          as="h6"
          mb="20px"
          pb="5px"
          borderBottom="1px solid var(--chakra-colors-orange-500)"
          display="flex"
          alignItems="center"
        >
          <QuestionOutlineIcon mr="12px" />
          {t('gacha.index.howItWorks.title')}
        </Heading>
        <Text mb="30px">{t('gacha.index.howItWorks.description')}</Text>
        <CommandTable configSell={configSell} configPrice={configPrice} />
        <Text mb="10px" fontWeight="bold">
          {t('gacha.index.additionalInfo.title')}
        </Text>
        <UnorderedList>
          <ListItem>{t('gacha.index.additionalInfo.item1')}</ListItem>
          <ListItem>{t('gacha.index.additionalInfo.item2')}</ListItem>
          <ListItem>
            <Text>{t('gacha.index.additionalInfo.item3')}</Text>
            <UnorderedList listStyleType="disclosure-closed" ml="50px">
              {Object.keys(configDropChances)
                .sort()
                .map((key) => {
                  const dropChance = configDropChances[key];

                  return (
                    <ListItem key={key}>
                      <Trans
                        i18nKey="gacha.index.additionalInfo.item3_subitem"
                        components={{
                          highlight: <Text as="span" color="orange.300" />,
                          text: <Text as="span" />,
                        }}
                        values={{ level: key, dropChance }}
                      />
                    </ListItem>
                  );
                })}
            </UnorderedList>
          </ListItem>
          <ListItem>{t('gacha.index.additionalInfo.item4')}</ListItem>
          <ListItem>{t('gacha.index.additionalInfo.item5')}</ListItem>
          <UnorderedList listStyleType="disclosure-closed" ml="50px">
            <ListItem>
              {t('gacha.index.additionalInfo.item5a', {
                xp: configCardXP.basic,
              })}
            </ListItem>
            <ListItem>
              {t('gacha.index.additionalInfo.item5b', {
                xp: configCardXP.gold,
              })}
            </ListItem>
            <ListItem>
              {t('gacha.index.additionalInfo.item5c', {
                totalXp: configCardXP.basic + configCardXP.gold,
                basicXP: configCardXP.basic,
                goldXP: configCardXP.gold,
              })}
            </ListItem>
          </UnorderedList>
        </UnorderedList>
        <LevelsTable configLevels={configLevels} />
        <DiscordCTA />
      </Box>
    </Flex>
  );
}

export default GachaPage;

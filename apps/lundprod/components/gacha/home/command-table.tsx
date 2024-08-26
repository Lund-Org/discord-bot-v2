import {
  Box,
  Code as ChakraCode,
  Table as ChakraTable,
  Tbody,
  Td as ChakraTd,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { PriceConfig, SellConfig } from '@discord-bot-v2/common';
import styled from '@emotion/styled';
import { Trans, useTranslation } from 'react-i18next';

type CommandTableProps = {
  configSell: SellConfig;
  configPrice: PriceConfig;
};

const Table = styled(ChakraTable)`
  & tr:nth-of-type(odd) td {
    background: var(--chakra-colors-blackAlpha-400);
  }
  & tr td:nth-child(2) {
    border-left: 1px solid var(--chakra-colors-blackAlpha-600);
    border-right: 1px solid var(--chakra-colors-blackAlpha-600);
  }
`;
const Td = styled(ChakraTd)`
  padding-left: 12px;
  padding-right: 12px;
`;
const Code = styled(ChakraCode)`
  background: var(--chakra-colors-gray-300);
`;

export const CommandTable = ({
  configPrice,
  configSell,
}: CommandTableProps) => {
  const { t } = useTranslation();
  const commands = [
    {
      cmd: '/gacha join',
      description: t('gacha.index.commandTable.joinDescription'),
      example: '',
    },
    {
      cmd: '/gacha view <id>',
      description: t('gacha.index.commandTable.viewDescription'),
      example: (
        <>
          <Code>/gacha view 9</Code>
          <Text>{t('gacha.index.commandTable.viewExample')}</Text>
        </>
      ),
    },
    {
      cmd: '/gacha help',
      description: t('gacha.index.commandTable.helpDescription'),
      example: '',
    },
    {
      cmd: '/gacha profile',
      description: t('gacha.index.commandTable.profileDescription'),
      example: '',
    },
    {
      cmd: '/gacha daily',
      description: t('gacha.index.commandTable.dailyDescription'),
      example: '',
    },
    {
      cmd: '/gacha points',
      description: t('gacha.index.commandTable.pointsDescription'),
      example: '',
    },
    {
      cmd: '/gacha cards',
      description: t('gacha.index.commandTable.cardsDescription'),
      example: '',
    },
    {
      cmd: '/gacha buy <1-6>',
      description: t('gacha.index.commandTable.buyExample', {
        points: configPrice.price,
      }),
      example: (
        <>
          <Code>/gacha buy 3</Code>
          <Text>
            {t('gacha.index.commandTable.buyExample', {
              points: configPrice.price * 3,
            })}
          </Text>
        </>
      ),
    },
    {
      cmd: '/gacha gold <id>',
      description: t('gacha.index.commandTable.goldDescription'),
      example: (
        <>
          <Code>/gacha gold 20</Code>
          <Text>{t('gacha.index.commandTable.goldExample')}</Text>
        </>
      ),
    },
    {
      cmd: '/gacha fusion',
      description: t('gacha.index.commandTable.fusionDescription'),
      example: '',
    },
    {
      cmd: '/gacha twitch <pseudo>',
      description: t('gacha.index.commandTable.twitchDescription'),
      example: (
        <>
          <Code>/gacha twitch LundProd</Code>
          <Text>{t('gacha.index.commandTable.twitchExample')}</Text>
        </>
      ),
    },
    {
      cmd: '/gacha sell <id> <basic|gold> <quantity>',
      description: (
        <Box>
          <Trans
            i18nKey="gacha.index.commandTable.sellDescription"
            values={{
              basicXP: configSell.basic,
              goldXP: configSell.gold,
            }}
            components={{
              text: <Text as="span" />,
              code: <Code display="inline" />,
            }}
          />
        </Box>
      ),
      example: (
        <>
          <Code>/gacha sell 12 basic 3</Code>
          <Text>
            {t('gacha.index.commandTable.sellExample', {
              points: configSell.basic * 3,
            })}
          </Text>
        </>
      ),
    },
    {
      cmd: '/gacha gift <code>',
      description: t('gacha.index.commandTable.giftDescription'),
      example: (
        <>
          <Code>/gacha gift {'<code>'}</Code>
          <Text>{t('gacha.index.commandTable.giftExample')}</Text>
        </>
      ),
    },
    {
      cmd: '/gacha dismantle <id>',
      description: t('gacha.index.commandTable.dismantleDescription'),
      example: (
        <>
          <Code>/gacha dismantle 54</Code>
          <Text>{t('gacha.index.commandTable.dismantleExample')}</Text>
        </>
      ),
    },
  ];

  return (
    <Box overflowX="auto" w="100%" maxW="100%">
      <Table mb="30px" minW="500px">
        <Thead>
          <Tr>
            <Th color="orange.300">
              {t('gacha.index.commandTable.header.command')}
            </Th>
            <Th color="orange.300">
              {t('gacha.index.commandTable.header.description')}
            </Th>
            <Th color="orange.300">
              {t('gacha.index.commandTable.header.example')}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {commands.map(({ cmd, description, example }, index) => (
            <Tr key={index}>
              <Td>
                <Code>{cmd}</Code>
              </Td>
              <Td>{description}</Td>
              <Td>
                {typeof example === 'string' ? <Text>{example}</Text> : example}
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

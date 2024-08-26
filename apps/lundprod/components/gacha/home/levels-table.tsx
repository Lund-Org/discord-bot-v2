import {
  Box,
  Table,
  Tbody,
  Td,
  Text,
  // Th,
  // Thead,
  Tr,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

type LevelsTableProps = {
  configLevels: Record<string, number>;
};

export const LevelsTable = ({ configLevels }: LevelsTableProps) => {
  const { t } = useTranslation();

  return (
    <Box mt="30px">
      <Text fontWeight="bold">{t('gacha.index.xpTable.title')}</Text>
      <Box pt={2} w="100%" maxW="100%" overflowX="auto">
        <Table>
          <Tbody>
            <Tr>
              <Td bg="blackAlpha.300" fontWeight="bold">
                {t('gacha.index.xpTable.level')}
              </Td>
              {Object.keys(configLevels)
                .map((x) => parseInt(x, 10))
                .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
                .map((lvl) => (
                  <Td
                    key={lvl}
                    borderLeft="1px solid var(--chakra-colors-whiteAlpha-300)"
                    textAlign="center"
                  >
                    {lvl}
                  </Td>
                ))}
            </Tr>
            <Tr>
              <Td whiteSpace="nowrap" bg="blackAlpha.300" fontWeight="bold">
                {t('gacha.index.xpTable.xpNeeded')}
              </Td>
              {Object.keys(configLevels)
                .map((x) => parseInt(x, 10))
                .sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
                .map((lvl) => (
                  <Td
                    key={lvl}
                    borderLeft="1px solid var(--chakra-colors-whiteAlpha-300)"
                  >
                    {configLevels[lvl]}
                  </Td>
                ))}
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

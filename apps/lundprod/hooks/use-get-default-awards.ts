import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export const useGetDefaultAwards = () => {
  const { t } = useTranslation();
  const defaultCategories = useMemo(
    () => [
      t('awards.defaultCategories.goty'),
      t('awards.defaultCategories.bestGameDirection'),
      t('awards.defaultCategories.bestNarrative'),
      t('awards.defaultCategories.bestArtDirection'),
      t('awards.defaultCategories.bestMusic'),
      t('awards.defaultCategories.bestAudio'),
      t('awards.defaultCategories.accessibility'),
      t('awards.defaultCategories.impact'),
      t('awards.defaultCategories.bestOngoing'),
      t('awards.defaultCategories.bestIndie'),
      t('awards.defaultCategories.bestDebutIndie'),
      t('awards.defaultCategories.bestAction'),
      t('awards.defaultCategories.bestAdventure'),
      t('awards.defaultCategories.bestRPG'),
      t('awards.defaultCategories.bestFighting'),
      t('awards.defaultCategories.bestFamily'),
      t('awards.defaultCategories.bestStrategy'),
      t('awards.defaultCategories.bestSports'),
      t('awards.defaultCategories.bestMultiplayer'),
      t('awards.defaultCategories.mostAnticipated'),
    ],
    [t],
  );

  return defaultCategories;
};

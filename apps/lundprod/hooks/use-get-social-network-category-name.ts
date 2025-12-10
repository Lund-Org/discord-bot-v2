import { useTranslation } from 'react-i18next';

import { NetworkKey } from '../utils/url';

export const useGetSocialNetworkCategoryName = (category: NetworkKey) => {
  const { t } = useTranslation();

  switch (category) {
    case 'global':
      return t('contact.global');
    case 'lundprodGameDev':
      return t('contact.gamedev');
    case 'lundprod':
      return t('contact.videogame');
    default:
      return '';
  }
};

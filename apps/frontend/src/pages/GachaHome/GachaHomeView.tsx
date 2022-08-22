import { useGachaHome } from './GachaHomeContext';
import { GachaHomeEmptyView } from './views/GachaHomeEmptyView';
import { GachaHomeWebView } from './views/GachaHomeWebView';

type Props = {
  mobile: boolean;
};

export const GachaHomeView = ({ mobile }: Props) => {
  const { cardSelected } = useGachaHome();

  if (mobile) {
    return null;
  }

  return cardSelected ? <GachaHomeWebView /> : <GachaHomeEmptyView />;
};

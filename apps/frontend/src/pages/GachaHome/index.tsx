import React, { useEffect, useState } from 'react';
import { GachaHomeProvider } from './GachaHomeContext';
import { GachaHomeNavigation } from './GachaHomeNavigation';
import { GachaHomeView } from './GachaHomeView';
import './GachaHome.scss';

const GachaHome = (): JSX.Element => {
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    function checkWindowSize() {
      setMobile(window.innerWidth <= 600);
    }

    checkWindowSize();
    window.addEventListener('resize', checkWindowSize);
    return () => {
      window.removeEventListener('resize', checkWindowSize);
    };
  }, []);

  return (
    <div className="gacha-home">
      <GachaHomeProvider>
        <GachaHomeNavigation mobile={isMobile} />
        <GachaHomeView mobile={isMobile} />
      </GachaHomeProvider>
    </div>
  );
};

export default GachaHome;

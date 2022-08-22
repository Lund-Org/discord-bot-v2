import { Rank as RankType } from '@discord-bot-v2/common'
import { useEffect, useState } from 'react';
import { fetchRanks } from '../../API/ranksAPI';
import Loader from '../../components/Loader';
import Rank from '../../components/Rank';
import RankList from '../../components/RankList';
import './GachaRanks.scss';

const GachaRanks = () => {
  const [isLoading, setLoader] = useState(true);
  const [ranks, updateRanks] = useState([] as RankType[]);

  useEffect(() => {
    fetchRanks().then((ranks: RankType[]) => {
      updateRanks(ranks);
      setLoader(false);
    });
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const [top1, top2, top3, ...others] = ranks;

  return (
    <div className="gacha-ranks">
      <div className="gacha-top-ranks">
        {top1 ? <Rank rank={top1} level={1} /> : null}
        {top2 ? <Rank rank={top2} level={2} /> : null}
        {top3 ? <Rank rank={top3} level={3} /> : null}
      </div>
      <div className="gacha-rank-list">
        <RankList ranks={others} />
      </div>
    </div>
  );
};

export default GachaRanks;

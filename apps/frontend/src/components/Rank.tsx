import { Rank as RankType } from '@discord-bot-v2/common'

type RankProps = {
  rank: RankType;
  level: number;
};

const Rank = ({ rank, level }: RankProps) => {
  const getMedal = () => {
    switch (level) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      default:
        return '🥉';
    }
  };

  return (
    <div className={`rank-item top-${level}`}>
      <div className="rank-medal-icon">{getMedal()}</div>
      <div className="rank-username">
        <a href={`/profile/${rank.discordId}`}>{rank.username}</a>
      </div>
      <div className="rank-level">Niveau : {rank.level.currentLevel}</div>
      <div className="rank-xp">XP : {rank.currentXP}</div>
    </div>
  );
};

export default Rank;

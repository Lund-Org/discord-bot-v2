import { Rank } from "@discord-bot-v2/common";

type RankListProps = {
  ranks: Rank[];
};

const RankList = ({ ranks }: RankListProps) => {
  return (
    <ol start={4}>
      {ranks.map((rank) => (
        <li className="ranklist-item">
          <a href={`/profile/${rank.discordId}`}>
            <strong>{rank.username}</strong>
          </a>
          <span>
            , niveau {rank.level.currentLevel} avec {rank.currentXP}xp
          </span>
        </li>
      ))}
    </ol>
  );
};

export default RankList;

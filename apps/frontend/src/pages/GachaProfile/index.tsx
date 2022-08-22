import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchCardsToGold } from '../../API/cardsAPI';
import { fetchFusions, fetchProfile } from '../../API/profileAPI';
import { fetchRank } from '../../API/ranksAPI';
import Loader from '../../components/Loader';
import { ProfileInventory } from './ProfileInventory';
import './GachaProfile.scss';
import { InventoryFilter } from './InventoryFilter';
import { AllCards, filterCards } from '../../utils/filters';
import { CardType, Filters, Inventory, Profile, Rank } from '@discord-bot-v2/common';

const GachaProfile = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [isLoading, setLoader] = useState(true);
  const [profile, updateProfile] = useState<Profile | null>(null);
  const [rank, updateRank] = useState<Rank | null>(null);
  const [possibleFusions, updatePossibleFusions] = useState<CardType[]>(
    [],
  );
  const [cardsToGold, updateCardsToGold] = useState<Inventory[]>([]);
  const [inventoryFilter, updateInventoryFilter] = useState<Filters>({
    gold: false,
    fusion: false,
    filterStars: AllCards,
    search: '',
  });
  const [toGoldFilter, updateToGoldFilter] = useState<Filters>({
    gold: true,
    fusion: false,
    filterStars: AllCards,
    search: '',
  });

  useEffect(() => {
    Promise.all([fetchProfile(id), fetchCardsToGold(id)])
      .then(([_profile, _cardsToGold]) => {
        updateProfile(_profile);
        updateCardsToGold(_cardsToGold);

        return Promise.all([
          fetchRank(_profile.id),
          fetchFusions(_profile.discordId),
        ]);
      })
      .then(([_rank, fusions]) => {
        updateRank(_rank);
        updatePossibleFusions(fusions);
        setLoader(false);
      });
  }, [id]);

  const basicCards = useMemo(
    () =>
      profile
        ? filterCards(
            profile.playerInventory.filter((x) => x.type === 'basic'),
            inventoryFilter,
          )
        : [],
    [profile, inventoryFilter],
  );
  const goldCards = useMemo(
    () =>
      profile
        ? filterCards(
            profile.playerInventory.filter((x) => x.type === 'gold'),
            inventoryFilter,
          )
        : [],
    [profile, inventoryFilter],
  );
  const toGoldCards = useMemo(
    () => filterCards(cardsToGold, toGoldFilter),
    [cardsToGold, toGoldFilter],
  );

  if (isLoading) {
    return <Loader />;
  }
  if (!profile || !rank) {
    return (
      <div className="gacha-profile-error">
        <h2>T'es qui sur internet ?</h2>
        <p>Ce profil n'existe pas</p>
      </div>
    );
  }

  return (
    <div className="gacha-profile">
      <h1 className="no-margin-bottom">{profile.username}</h1>
      {profile.twitch_username ? (
        <span className="subtitle">
          Ou&nbsp;
          <a
            href={`https://twitch.tv/${profile.twitch_username}`}
            target="_blank"
            rel="noreferrer"
          >
            {profile.twitch_username}
          </a>
          &nbsp;sur Twitch
        </span>
      ) : null}
      <hr />
      <p>Points actuels : {profile.points}</p>
      <p>Niveau actuel : {rank.level.currentLevel}</p>
      <p>Rang actuel : {rank.position}</p>
      <p>XP actuelle : {rank.currentXP}</p>
      <p>XP du prochain niveau : {rank.level.xpNextLevel}</p>
      <p>A rejoint le Discord le {formatDate(profile.joinDate)}</p>
      {profile.lastDailyDraw ? (
        <p>
          Dernier tirage de carte le {formatDateTime(profile.lastDailyDraw)}
        </p>
      ) : null}
      <hr />
      <div className="column-container column-container-800">
        <div className="column">
          <h3>Inventaire :</h3>
          <InventoryFilter
            filters={inventoryFilter}
            updateFilters={updateInventoryFilter}
          />
          <div className="scrollable-container">
            <ProfileInventory
              cards={basicCards}
              textFormatter={(card) => `(x${card.total})`}
            />
            <ProfileInventory
              className="gold-cards"
              cards={goldCards}
              textFormatter={(card) => `(x${card.total})`}
            />
          </div>
        </div>
        <div className="column">
          <h3>Cartes à golder :</h3>
          <InventoryFilter
            filters={toGoldFilter}
            updateFilters={updateToGoldFilter}
          />
          <div className="scrollable-container">
            {toGoldCards.length ? (
              <ProfileInventory
                cards={toGoldCards}
                textFormatter={(card) =>
                  `(${card.total} cartes basiques actuellement)`
                }
              />
            ) : (
              <p>Aucune carte à golder</p>
            )}
          </div>
        </div>
        {toGoldCards.length ? (
          <div className="column">
            <h3>Cartes fusionnables :</h3>
            <div className="scrollable-container">
              {toGoldCards.length ? (
                <ProfileInventory
                  cards={possibleFusions}
                  textFormatter={() => ''}
                />
              ) : (
                <p>Aucune carte à golder</p>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

function formatDate(date: Date) {
  const months = [
    'Janvier',
    'Fevrier',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Aout',
    'Septembre',
    'Octobre',
    'Novembre',
    'Decembre',
  ];

  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function formatDateTime(date: Date) {
  return `${formatDate(date)} ${date
    .getHours()
    .toString()
    .padStart(2, '0')}h${date.getMinutes().toString().padStart(2, '0')}`;
}

export default GachaProfile;

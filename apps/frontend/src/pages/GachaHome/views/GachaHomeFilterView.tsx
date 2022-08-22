import { options } from '../../../utils/filters';
import { useGachaHome } from '../GachaHomeContext';

export const GachaHomeFilterView = () => {
  const { filters, updateFilters } = useGachaHome();

  const update = (key: string, value: unknown) => {
    updateFilters({
      ...filters,
      [key]: value,
    });
  };

  return (
    <div className="home-filter-view">
      <div className="home-filter-group">
        <input
          type="text"
          onChange={(event) => update('search', event.target.value)}
          value={filters.search}
          placeholder="Recherche"
        />
      </div>
      <div className="home-filter-group">
        <label>Nombre d'étoiles : </label>
        <select
          value={filters.filterStars}
          onChange={(event) => update('filterStars', event.target.value)}
        >
          {options.map((opt, index) => (
            <option value={opt} key={index}>
              {opt}
            </option>
          ))}
        </select>
      </div>
      <div className="home-filter-group">
        <label>
          <input
            type="checkbox"
            onChange={() => update('gold', !filters.gold)}
            checked={filters.gold}
          />
          Visualiser les cartes en dorée
        </label>
      </div>
      <div className="home-filter-group">
        <label>
          <input
            type="checkbox"
            onChange={() => update('fusion', !filters.fusion)}
            checked={filters.fusion}
          />
          Cartes fusions uniquement
        </label>
      </div>
    </div>
  );
};

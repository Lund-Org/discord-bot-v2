import { Filters } from '@discord-bot-v2/common';
import { useRef, useState } from 'react';
import { useOnClickOutside } from '../../hooks/use-click-outside';
import { options } from '../../utils/filters';

type InventoryFilterProps = {
  filters: Filters;
  updateFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

export const InventoryFilter = ({
  filters,
  updateFilters,
}: InventoryFilterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const update = (key: string, value: unknown) => {
    updateFilters({
      ...filters,
      [key]: value,
    });
  };
  useOnClickOutside(ref, () => setIsFilterOpen(false));

  return (
    <div className="inventory-filter" ref={ref}>
      <div
        className="right-align"
        onClick={() => setIsFilterOpen(!isFilterOpen)}
      >
        <button>Filtrer</button>
      </div>
      <div
        className="dropdown"
        style={{ display: isFilterOpen ? 'block' : 'none' }}
      >
        <div className="filter-group">
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
        <div className="filter-group">
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
    </div>
  );
};

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Menu from './components/Menu';
import GachaHome from './pages/GachaHome';
import GachaProfile from './pages/GachaProfile';
import GachaRanks from './pages/GachaRanks';
import './styles/card.scss';
import './styles/helper.scss';
import './styles/index.scss';
import './styles/menu.scss';
import './styles/rank.scss';

const root = createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Router>
      <Menu />
      <Routes>
        <Route path="/ranks" element={<GachaRanks />} />
        <Route path="/profile/:id" element={<GachaProfile />} />
        <Route path="/" element={<GachaHome />} />
      </Routes>
    </Router>
  </StrictMode>
);

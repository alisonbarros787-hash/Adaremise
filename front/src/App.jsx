import { useState } from 'react';
import './App.css';
import Benevole from './Benevole.jsx';
import ListeObjets from './ListeObjet.jsx';

function App() {
  const [pageActive, setPageActive] = useState('benevoles');

  return (
    <div className="app-container">
      <div className="main-card">
        <header className="app-header">
          <div className="brand-badge">
            <h1>Association - La remise</h1>
          </div>
          <p className="subtitle">Gestion des bénévoles et des objets</p>
        </header>

        <nav className="tab-navigation">
          <button 
            className={`tab-btn ${pageActive === 'benevoles' ? 'active' : ''}`}
            onClick={() => setPageActive('benevoles')}
          >
            Bénévoles
          </button>
          <button 
            className={`tab-btn ${pageActive === 'inventaire' ? 'active' : ''}`}
            onClick={() => setPageActive('inventaire')}
          >
            Inventaire
          </button>
        </nav>

        <div className="content-stack">
          {pageActive === 'benevoles' ? <Benevole /> : <ListeObjets />}
        </div>
      </div>
    </div>
  );
}

export default App;
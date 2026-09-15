import './App.css'
import Benevole from './Benevole.jsx'
import FicheObjet from './FicheObjet.jsx'
import ListeObjets from './ListeObjet.jsx'
import UserBack from './UserHistorique.jsx'
import Depot from './Depot.jsx'
import { Routes, Route } from 'react-router-dom'
import Stats from './Stat.jsx'
import Nav from './Nav.jsx'
import logo from './assets/logo.png';


function App() {

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="Logo La Remise" className="logo-badge" />
          <div>
            <h1>La remise</h1>
            <p className="subtitle">Bénévoles &amp; objets</p>
          </div>
        </div>

        <Nav />
      </aside>

      <main className="main-panel">
        <Routes>
          <Route path="/" element={<Benevole />} />
          <Route path="/objets" element={<ListeObjets />} />
          <Route path="/objets/:id" element={<FicheObjet />} />
          <Route path="/depots" element={<Depot />} />
          <Route path="/depots/:id" element={<UserBack />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
 
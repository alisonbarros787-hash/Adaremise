import './App.css'
import Benevole from './Benevole.jsx'
import FicheObjet from './FicheObjet.jsx'
import ListeObjets from './ListeObjet.jsx'
import UserBack from './UserHistorique.jsx'
import Depot from './Depot.jsx'
import { Routes, Route } from 'react-router-dom'
import Stats from './Stat.jsx'
import Nav from './Nav.jsx'


function App() {
 

  return (
   <div className="app-container">
      <header className="app-header">
        <h1>Association - La remise</h1>
        <p className="subtitle">Gestion des bénévoles et des objets</p>
      </header>

      <Nav />

      <main className="main-content">
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
 
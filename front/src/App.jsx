import './App.css'
import Benevole from './Benevole.jsx'
import FicheObjet from './FicheObjet.jsx'
import ListeObjets from './ListeObjet.jsx'
import { Routes, Route } from 'react-router-dom'
import Stats from './Stat.jsx'


function App() {
 

  return (
    <Routes>
       {/* Quand l'URL est '/', le composant Benevole s'affiche le omposant Benevole.jsx */}
      <Route path="/" element={<Benevole/>}/>
      <Route path="/objets" element={<ListeObjets/>}/>
      <Route path="/objets/:id" element={<FicheObjet/>}/>
      <Route path="/stats" element={<Stats/>}/>
    </Routes>
  )
}

export default App
 
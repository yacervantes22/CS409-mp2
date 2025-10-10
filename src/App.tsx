import React from 'react';

import './App.css';

import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link, 
  useLocation 
} from 'react-router-dom';

import { 
  PokemonList 
} from './pages/PokemonList';

import { 
  PokemonGallery 
} from './pages/PokemonGallery';

import { 
  PokemonDetails 
} from './pages/PokemonDetails';

import './App.css';


// Navigation Bar Component

function NavigationBar() {
  const location = useLocation();
  return (
  <nav className="app-nav">
    <Link to="/" className={
      location.pathname === '/'
      ? 'app-nav-link app-nav-link-active'
      : 'app-nav-link'
      } >
      List View
    </Link>
    <Link to="/gallery" className={ 
      location.pathname === '/gallery'
      ? 'app-nav-link app-nav-link-active'
      : 'app-nav-link'
      }>
      Gallery View
    </Link>
  </nav>
  );
}

function App() {
  return (
    <BrowserRouter basename="/CS409-mp2">
      <div className="app">
        <header className="app-header">
          <h1 className="app-header-title">Pokédex App</h1>
        </header>

        <NavigationBar />

        <main className="app-content">
          <Routes>
            <Route path="/" element={<PokemonList />} />
            <Route path="/gallery" element={<PokemonGallery />} />
            <Route path="/pokemon/:id" element={<PokemonDetails />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

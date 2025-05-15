import React, { useState } from 'react';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nomeUsuario, setNomeUsuario] = useState('');

  const handleLogin = (nome) => {
    setNomeUsuario(nome);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setNomeUsuario('');
  };

  return (
    <>
      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} nomeUsuario={nomeUsuario} />
      ) : (
        <Auth onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;

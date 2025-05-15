import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <>
      {!isLoggedIn ? (
        <LoginForm onLogin={() => setIsLoggedIn(true)} />
      ) : (
        <Dashboard />
      )}
      {isLoggedIn ? (
        <Dashboard onLogout={() => setIsLoggedIn(false)} nomeUsuario="Vitória" />
      ) : (
        <Auth onLogin={() => setIsLoggedIn(true)} />
      )}

    </>
  );
}

export default App;

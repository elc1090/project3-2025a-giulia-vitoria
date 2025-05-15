import React, { useState } from 'react';

export default function Header({ onSearch }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    // Lógica de logout (por exemplo, remover token, redirecionar, etc.)
    console.log("Logout efetuado");
    window.location.href = '/'; // ou redirecione para a tela de login
  };

  return (
    <header style={styles.header}>
      <div style={styles.logo}>Linkaí</div>
      <input
        type="search"
        placeholder="Buscar links..."
        onChange={e => onSearch(e.target.value)}
        style={styles.search}
      />
      <div style={styles.profileContainer}>
        <div style={styles.profile} onClick={() => setMenuOpen(!menuOpen)}>
          Vitória ▾
        </div>
        {menuOpen && (
          <div style={styles.dropdown}>
            <button onClick={handleLogout} style={styles.dropdownItem}>
              Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#2c3e50',
    color: 'white',
    padding: '10px 20px',
    position: 'relative',
  },
  logo: { fontSize: '24px', fontWeight: 'bold' },
  search: {
    flexGrow: 1,
    margin: '0 20px',
    padding: '8px 12px',
    borderRadius: '6px',
    border: 'none',
    fontSize: '16px',
  },
  profileContainer: {
    position: 'relative',
  },
  profile: {
    cursor: 'pointer',
    userSelect: 'none',
  },
  dropdown: {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: '8px',
    background: '#fff',
    color: '#000',
    borderRadius: '4px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    zIndex: 1,
  },
  dropdownItem: {
    padding: '10px 20px',
    background: 'none',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
  },
};

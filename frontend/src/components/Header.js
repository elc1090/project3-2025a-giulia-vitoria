import React from 'react';

export default function Header({ onSearch }) {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>Linkaí</div>
      <input
        type="search"
        placeholder="Buscar links..."
        onChange={e => onSearch(e.target.value)}
        style={styles.search}
      />
      <div style={styles.profile}>👤 Vitória</div>
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
  profile: { cursor: 'pointer' }
};

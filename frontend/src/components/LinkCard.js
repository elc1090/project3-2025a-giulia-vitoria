import React, { useState } from 'react';

export default function LinkCard({ link, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div style={styles.card}>
      <div>
        <a href={link.url} target="_blank" rel="noreferrer" style={styles.title}>{link.title}</a>
        <p style={styles.description}>{link.description}</p>
      </div>
      <div style={{ position: 'relative' }}>
        <button onClick={() => setMenuOpen(!menuOpen)} style={styles.menuButton}>⋮</button>
        {menuOpen && (
          <ul style={styles.menu}>
            <li onClick={() => { setMenuOpen(false); onEdit(link); }} style={styles.menuItem}>Editar</li>
            <li onClick={() => { setMenuOpen(false); onDelete(link.id); }} style={styles.menuItem}>Excluir</li>
          </ul>
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    padding: '15px',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    minWidth: 0,  // evita overflow no grid
  },
  title: {
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#2c3e50',
    textDecoration: 'none',
  },
  description: {
    fontSize: '14px',
    color: '#555',
  },
  menuButton: {
    background: 'transparent',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '5px',
  },
  menu: {
    position: 'absolute',
    right: 0,
    top: '25px',
    background: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    borderRadius: '6px',
    listStyle: 'none',
    padding: '8px 0',
    margin: 0,
    width: '100px',
    zIndex: 100,
  },
  menuItem: {
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#333',
  }
};

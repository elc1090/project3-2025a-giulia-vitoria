import React from 'react';

export default function Sidebar({ favorites }) {
  return (
    <aside style={styles.sidebar}>
      <h3>Favoritos</h3>
      <ul style={styles.list}>
        {favorites.length === 0 && <li style={{ color: '#999' }}>Nenhum favorito</li>}
        {favorites.map(link => (
          <li key={link.id} style={styles.item}>
            <a href={link.url} target="_blank" rel="noreferrer">{link.title}</a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '220px',
    background: '#f4f6f8',
    padding: '20px',
    borderRight: '1px solid #ddd',
    height: 'calc(100vh - 60px)', // considerando header fixo 60px
    overflowY: 'auto'
  },
  list: {
    listStyle: 'none',
    paddingLeft: 0,
  },
  item: {
    marginBottom: '12px',
  }
};

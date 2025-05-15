import React from 'react';
import LinkCard from './LinkCard';

export default function LinkList({ links, onEdit, onDelete, grid = false }) {
  if (links.length === 0) {
    return <p style={{ textAlign: 'center', color: '#777' }}>Nenhum link encontrado.</p>;
  }

  const containerStyle = grid
    ? {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '15px',
      }
    : {};

  return (
    <div style={containerStyle}>
      {links.map(link => (
        <LinkCard key={link.id} link={link} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}

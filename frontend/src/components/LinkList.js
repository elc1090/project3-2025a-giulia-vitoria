import React from 'react';

export default function LinkList({ links, onEdit, onDelete }) {
  if (!links || links.length === 0) {
    return <p style={{ padding: '20px' }}>Nenhum link encontrado.</p>;
  }

  const containerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
  };

  const cardStyle = {
    background: 'white',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    width: '250px',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  };

  const cardHoverStyle = {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  };

  const titleStyle = {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '8px',
    wordWrap: 'break-word',
  };

  const urlStyle = {
    color: '#333',
    textDecoration: 'none',
    wordBreak: 'break-all',
    fontSize: '14px',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
  };

  const buttonStyle = {
    padding: '6px 10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    backgroundColor: '#2c3e50',
    color: 'white',
  };

  return (
    <div style={containerStyle}>
      {links.map(link => (
        <div
          key={link.id}
          style={cardStyle}
          onClick={() => window.open(link.url, '_blank')}
          onMouseEnter={e => Object.assign(e.currentTarget.style, cardHoverStyle)}
          onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle)}
        >
          <div style={titleStyle}>{link.title}</div>
          <div><span style={urlStyle}>{link.url}</span></div>
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#555' }}>
            {link.description}
          </div>
          <div style={buttonContainerStyle} onClick={e => e.stopPropagation()}>
            <button style={buttonStyle} onClick={() => onEdit(link)}>Editar</button>
            <button style={buttonStyle} onClick={() => onDelete(link.id)}>Excluir</button>
          </div>
        </div>
      ))}
    </div>
  );
}

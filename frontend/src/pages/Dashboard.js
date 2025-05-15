import React, { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import LinkList from '../components/LinkList';

const MOCK_LINKS = [
  { id: 1, title: 'React', url: 'https://reactjs.org', description: 'Biblioteca JS para UI' },
  { id: 2, title: 'GitHub', url: 'https://github.com', description: 'Hospedagem de código' },
  { id: 3, title: 'Stack Overflow', url: 'https://stackoverflow.com', description: 'Perguntas e respostas' },
];

export default function Dashboard() {
  const [links, setLinks] = useState(MOCK_LINKS);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Estado do formulário
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const filteredLinks = links.filter(link =>
    link.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddLink = (e) => {
    e.preventDefault();
    if (!newTitle || !newUrl) {
      alert('Título e URL são obrigatórios!');
      return;
    }

    const newLink = {
      id: Date.now(),
      title: newTitle,
      url: newUrl,
      description: newDescription
    };

    setLinks([newLink, ...links]);
    setNewTitle('');
    setNewUrl('');
    setNewDescription('');
  };

  const handleEdit = (link) => {
    alert(`Editar link: ${link.title}`);
  };

  const handleDelete = (id) => {
    if (window.confirm('Deseja realmente excluir esse link?')) {
      setLinks(current => current.filter(link => link.id !== id));
      setFavorites(current => current.filter(fav => fav.id !== id));
    }
  };

  return (
    <div style={styles.container}>
      <Header onSearch={setSearchTerm} />
      <div style={styles.main}>
        <Sidebar favorites={favorites} />

        <main style={styles.content}>
          <form onSubmit={handleAddLink} style={styles.form}>
            <input
              type="text"
              placeholder="Título"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="url"
              placeholder="URL"
              value={newUrl}
              onChange={e => setNewUrl(e.target.value)}
              style={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Descrição (opcional)"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Adicionar Link</button>
          </form>

          <LinkList
            links={filteredLinks}
            onEdit={handleEdit}
            onDelete={handleDelete}
            grid
          />
        </main>
      </div>
    </div>
  );
}

const styles = {
  container: { height: '100vh', display: 'flex', flexDirection: 'column' },
  main: { flex: 1, display: 'flex' },
  content: {
    flex: 1,
    padding: '20px',
    background: '#e9ebee',
    overflowY: 'auto'
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '20px',
    alignItems: 'center'
  },
  input: {
    flex: '1 1 150px',
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    minWidth: '150px'
  },
  button: {
    padding: '10px 18px',
    backgroundColor: '#2c3e50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
  }
};

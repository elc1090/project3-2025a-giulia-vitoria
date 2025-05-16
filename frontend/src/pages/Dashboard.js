import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import LinkList from '../components/LinkList';

export default function Dashboard({ nomeUsuario, onLogout }) {
  const [links, setLinks] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados do formulário
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newDescription, setNewDescription] = useState('');

  // Carrega os links da API ao montar o componente
  useEffect(() => {
    fetch('http://localhost:5000/bookmarks')
      .then(res => res.json())
      .then(data => {
        // Converte os campos do backend para os campos usados no frontend
        const formattedLinks = data.map(link => ({
          id: link.id,
          title: link.titulo,
          url: link.url,
          description: link.descricao || ''
        }));
        setLinks(formattedLinks);
      })
      .catch(err => {
        console.error('Erro ao carregar links:', err);
      });
  }, []);

  // Filtra os links pelo termo de busca
  const filteredLinks = links.filter(link =>
    link.title && link.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Adiciona um novo link via API
  const handleAddLink = async (e) => {
    e.preventDefault();
    if (!newTitle || !newUrl) {
      alert('Título e URL são obrigatórios!');
      return;
    }

    const newLinkData = {
      titulo: newTitle,
      url: newUrl,
      descricao: newDescription
    };

    try {
      const res = await fetch('http://localhost:5000/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLinkData)
      });

      if (!res.ok) throw new Error('Erro ao adicionar link');

      const result = await res.json();

      const newLink = {
        id: result.id,
        title: newTitle,
        url: newUrl,
        description: newDescription
      };

      setLinks([newLink, ...links]);
      setNewTitle('');
      setNewUrl('');
      setNewDescription('');
    } catch (error) {
      alert(error.message);
    }
  };

  // Editar (exemplo simples)
  const handleEdit = (link) => {
    alert(`Editar link: ${link.title}`);
  };

  // Deletar link via API
  const handleDelete = async (id) => {
    if (!window.confirm('Deseja realmente excluir esse link?')) return;

    try {
      const res = await fetch(`http://localhost:5000/bookmarks/${id}`, {
        method: 'DELETE'
      });

      if (!res.ok) throw new Error('Erro ao deletar link');

      setLinks(current => current.filter(link => link.id !== id));
      setFavorites(current => current.filter(fav => fav.id !== id));
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div style={styles.container}>
      <Header onSearch={setSearchTerm} nomeUsuario={nomeUsuario} onLogout={onLogout} />
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

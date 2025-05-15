import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Linkaí</h1>
        <p style={styles.subtitle}>Compartilhe e gerencie seus links com facilidade</p>
        <div style={styles.tabs}>
          <span style={styles.tab}>Cadastro</span>
          <span style={{ ...styles.tab, ...styles.activeTab }}>Login</span>
        </div>
        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={styles.input}
          />
          <button type="submit" style={styles.button}>Entrar</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f8f9fc'
  },
  card: {
    background: 'white',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    width: '320px'
  },
  title: {
    fontSize: '28px',
    marginBottom: '8px',
    color: '#2c3e50'
  },
  subtitle: {
    marginBottom: '20px',
    color: '#666'
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '20px'
  },
  tab: {
    cursor: 'pointer',
    color: '#777',
    fontSize: '14px'
  },
  activeTab: {
    fontWeight: 'bold',
    textDecoration: 'underline',
    color: '#2c3e50'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '16px'
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#2c3e50',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    border: 'none',
    transition: 'background 0.3s'
  }
};

export default LoginForm;

import React, { useState } from 'react';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

function Auth({ onLogin }) {
  const [activeTab, setActiveTab] = useState('register');

  const tabStyle = (tab) => ({
    cursor: 'pointer',
    margin: '0 10px',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    textDecoration: activeTab === tab ? 'underline' : 'none',
    fontSize: '18px',
    color: activeTab === tab ? '#2c3e50' : '#888'
  });

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Linkaí</h1>
        <p style={styles.subtitle}>Compartilhe e gerencie seus links com facilidade</p>

        <div style={styles.tabs}>
          <span style={tabStyle('register')} onClick={() => setActiveTab('register')}>Cadastro</span>
          <span style={{ color: '#ccc' }}>|</span>
          <span style={tabStyle('login')} onClick={() => setActiveTab('login')}>Login</span>
        </div>

        <div style={{ marginTop: 20 }}>
          {activeTab === 'login' ? <LoginForm onLogin={onLogin} /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f6f8fa',
  },
  card: {
    background: '#fff',
    padding: '30px 40px',
    borderRadius: '12px',
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px'
  },
  title: {
    textAlign: 'center',
    fontSize: '28px',
    marginBottom: '5px',
    color: '#2c3e50'
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '14px',
    marginBottom: '20px',
    color: '#888'
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default Auth;

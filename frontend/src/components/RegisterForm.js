import React, { useState } from 'react';

function RegisterForm() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    console.log('Cadastro:', { nome, email, senha });
  };

  return (
    <form onSubmit={handleRegister} style={styles.form}>
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
        style={styles.input}
      />
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
      <button type="submit" style={styles.button}>Cadastrar</button>
    </form>
  );
}

const styles = {
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

export default RegisterForm;

import React, { useState } from 'react';

function RegisterForm({ onRegister }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: nome,
          email: email,
          password: senha
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert("Usuário cadastrado com sucesso!");
        setNome('');
        setEmail('');
        setSenha('');
        if (onRegister) onRegister(); // opcional, para alternar aba
      } else {
        alert(`Erro: ${data.erro || 'Erro desconhecido'}`);
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao conectar com o servidor.");
    }
  };

  return (
    <form onSubmit={handleRegister} style={styles.form}>
      <input
        style={styles.input}
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required
      />
      <input
        style={styles.input}
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        style={styles.input}
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
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

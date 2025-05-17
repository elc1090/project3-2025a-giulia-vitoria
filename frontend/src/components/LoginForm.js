import React, { useState } from "react";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro("");

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: senha }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login bem-sucedido:", data);

        localStorage.setItem("user_id", data.user_id);

        if (onLogin) onLogin(data.username);
      } else {
        setErro(data.erro || "Erro no login");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setErro("Erro ao conectar ao servidor");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
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
      {erro && <span style={styles.erro}>{erro}</span>}
      <button type="submit" style={styles.button}>
        Entrar
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    padding: "12px",
    borderRadius: "8px",
    backgroundColor: "#2c3e50",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    border: "none",
    transition: "background 0.3s",
  },
  erro: {
    color: "red",
    fontSize: "14px",
  },
};

export default LoginForm;

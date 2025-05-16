from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection
import os
import bcrypt

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route("/test-db")
def test_db():
    try:
        conn = get_connection()
        cur = conn.cursor()
        cur.execute("SELECT 1;")
        result = cur.fetchone()
        cur.close()
        conn.close()
        return jsonify({"status": "Conexão bem-sucedida", "resultado": result})
    except Exception as e:
        return jsonify({"status": "Erro na conexão", "erro": str(e)}), 500
    pass

def create_user(username, email, password):
    conn = get_connection()
    if not conn:
        return False, "Erro na conexão com o banco"

    try:
        cur = conn.cursor()
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        cur.execute("""
            INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)
        """, (username, email, hashed_password.decode('utf-8')))
        conn.commit()
        cur.close()
        return True, "Usuário criado com sucesso"
    except Exception as e:
        conn.rollback()
        return False, str(e)
    finally:
        conn.close()
    pass

@app.route("/usuarios", methods=["POST"])
def cadastrar_usuario():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({"erro": "Dados incompletos"}), 400

    success, msg = create_user(username, email, password)

    if success:
        return jsonify({"msg": msg}), 201
    else:
        return jsonify({"erro": msg}), 400
    pass

@app.route("/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        # Resposta automática para o preflight
        return jsonify({}), 200

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"erro": "Email e senha são obrigatórios"}), 400

    conn = get_connection()
    cur = conn.cursor()
    try:
        cur.execute("SELECT username, password_hash FROM users WHERE email = %s", (email,))
        result = cur.fetchone()

        if not result:
            return jsonify({"erro": "Usuário não encontrado"}), 404

        username, stored_hash = result

        if bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8')):
            return jsonify({"msg": "Login bem-sucedido", "username": username}), 200
        else:
            return jsonify({"erro": "Senha incorreta"}), 401

    except Exception as e:
        return jsonify({"erro": str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route("/bookmarks", methods=["GET"])
def listar_bookmarks():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT id, titulo, url, descricao, criado_em FROM bookmarks ORDER BY criado_em DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    bookmarks = [
        {"id": r[0], "titulo": r[1], "url": r[2], "descricao": r[3], "criado_em": r[4].isoformat()}
        for r in rows
    ]
    return jsonify(bookmarks)

@app.route("/bookmarks", methods=["POST"])
def criar_bookmark():
    data = request.get_json()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO bookmarks (titulo, url, descricao) VALUES (%s, %s, %s) RETURNING id, titulo, url, descricao, criado_em",
        (data["titulo"], data["url"], data.get("descricao"))
    )
    new_bookmark = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({
        "id": new_bookmark[0],
        "titulo": new_bookmark[1],
        "url": new_bookmark[2],
        "descricao": new_bookmark[3],
        "criado_em": new_bookmark[4].isoformat()
    }), 201

@app.route("/bookmarks/<int:id>", methods=["PUT"])
def atualizar_bookmark(id):
    data = request.get_json()
    conn = get_connection()
    cur = conn.cursor()
    cur.execute(
        "UPDATE bookmarks SET titulo = %s, url = %s, descricao = %s WHERE id = %s",
        (data["titulo"], data["url"], data.get("descricao"), id)
    )
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"msg": "Atualizado com sucesso"})

@app.route("/bookmarks/<int:id>", methods=["DELETE"])
def deletar_bookmark(id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM bookmarks WHERE id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()
    return jsonify({"msg": "Deletado com sucesso"})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # usa a porta fornecida pelo Render ou 5000 localmente
    app.run(host="0.0.0.0", port=port, debug=True)
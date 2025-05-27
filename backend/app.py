from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection
import os
import bcrypt

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/folders', methods=['OPTIONS'])
def folders_options():
    return '', 204

@app.route('/bookmarks', methods=['OPTIONS'])
def bookmarks_options():
    return '', 204

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

@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")  

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("SELECT id, username, email, password_hash FROM users WHERE email = %s", (email,))
    user = cur.fetchone()

    cur.close()
    conn.close()

    if user is None:
        return jsonify({"erro": "Usuário não encontrado"}), 401

    stored_hash = user[3]

    if stored_hash and bcrypt.checkpw(password.encode('utf-8'), stored_hash.encode('utf-8')):
        return jsonify({
            "msg": "Login bem-sucedido",
            "user_id": user[0],
            "username": user[1]
        })

    return jsonify({"erro": "Credenciais inválidas"}), 401

@app.route("/bookmarks", methods=["GET"])
def listar_bookmarks():
    user_id = request.args.get("user_id")
    folder_id = request.args.get("folder_id")

    if not user_id:
        return jsonify({"erro": "user_id não fornecido"}), 400

    conn = get_connection()
    cur = conn.cursor()

    if folder_id:
        cur.execute(
            "SELECT id, titulo, url, descricao, criado_em FROM bookmarks WHERE user_id = %s AND folder_id = %s ORDER BY criado_em DESC",
            (user_id, folder_id)
        )
    else:
        cur.execute(
            "SELECT id, titulo, url, descricao, criado_em FROM bookmarks WHERE user_id = %s ORDER BY criado_em DESC",
            (user_id,)
        )

    rows = cur.fetchall()
    cur.close()
    conn.close()

    bookmarks = [
        {"id": r[0], "titulo": r[1], "url": r[2], "descricao": r[3], "criado_em": r[4].isoformat()}
        for r in rows
    ]
    return jsonify(bookmarks)


@app.route('/bookmarks', methods=['POST'])
def criar_bookmark():
    data = request.json
    titulo = data.get('titulo')
    url = data.get('url')
    descricao = data.get('descricao')
    user_id = data.get('user_id')
    folder_id = data.get('folder_id')

    if not titulo or not url or not user_id:
        return jsonify({'erro': 'Campos obrigatórios faltando'}), 400

    conn = get_connection()
    cur = conn.cursor()

    cur.execute('''
        INSERT INTO bookmarks (user_id, folder_id, titulo, url, descricao)
        VALUES (%s, %s, %s, %s, %s)
        RETURNING id
    ''', (user_id, folder_id, titulo, url, descricao))

    novo_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'id': novo_id}), 201


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

@app.route('/folders', methods=['GET'])
def listar_folders():
    user_id = request.args.get('user_id')

    if not user_id:
        return jsonify({'erro': 'user_id não fornecido'}), 400

    conn = get_connection()
    cur = conn.cursor()
    cur.execute('SELECT id, name FROM folders WHERE user_id = %s', (user_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()

    folders = [{'id': r[0], 'name': r[1]} for r in rows]

    return jsonify(folders)

@app.route('/folders', methods=['POST'])
def criar_folder():
    data = request.get_json()
    name = data.get('name')
    user_id = data.get('user_id')

    if not name or not user_id:
        return jsonify({'erro': 'Campos obrigatórios faltando'}), 400

    conn = get_connection()
    cur = conn.cursor()
    cur.execute('INSERT INTO folders (user_id, name) VALUES (%s, %s) RETURNING id', (user_id, name))
    novo_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({'id': novo_id}), 201

@app.route('/folders/<int:folder_id>', methods=['PUT'])
def atualizar_pasta(folder_id):
    data = request.get_json()
    novo_nome = data.get('name')
    if not novo_nome:
        return jsonify({'erro': 'Nome é obrigatório'}), 400

    conn = get_connection()
    cur = conn.cursor()
    cur.execute("UPDATE folders SET name = %s WHERE id = %s", (novo_nome, folder_id))
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({'msg': 'Pasta atualizada com sucesso'})

@app.route('/folders/<int:folder_id>', methods=['DELETE'])
def deletar_pasta(folder_id):
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM folders WHERE id = %s", (folder_id,))
    conn.commit()
    cur.close()
    conn.close()
    
    return jsonify({'msg': 'Pasta deletada com sucesso'})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))  # usa a porta fornecida pelo Render ou 5000 localmente
    app.run(host="0.0.0.0", port=port, debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS
from db import get_connection

app = Flask(__name__)
CORS(app)

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
        "INSERT INTO bookmarks (titulo, url, descricao) VALUES (%s, %s, %s) RETURNING id",
        (data["titulo"], data["url"], data.get("descricao"))
    )
    conn.commit()
    new_id = cur.fetchone()[0]
    cur.close()
    conn.close()
    return jsonify({"id": new_id}), 201

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
    app.run(debug=True)
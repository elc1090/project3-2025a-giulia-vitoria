import psycopg2
import os
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor
import bcrypt  # para hash da senha

load_dotenv()

def get_connection():
    try:
        database_url = os.getenv("DATABASE_URL")
        if database_url:
            conn = psycopg2.connect(database_url)
        else:
            conn = psycopg2.connect(
                host=os.getenv("DB_HOST"),
                dbname=os.getenv("DB_NAME"),
                user=os.getenv("DB_USER"),
                password=os.getenv("DB_PASSWORD"),
                port=os.getenv("DB_PORT", 5432)
            )
        return conn
    except Exception as e:
        print(f"Erro ao conectar ao banco de dados: {e}")
        return None

def create_user(username, email, password):
    conn = get_connection()
    if not conn:
        return False, "Erro na conexão com o banco"

    try:
        cur = conn.cursor()
        # Gerar hash da senha
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)

        cur.execute("""
            INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)
        """, (username, email, hashed_password.decode('utf-8')))
        conn.commit()
        cur.close()
        return True, "Usuário criado com sucesso"
    except psycopg2.IntegrityError:
        conn.rollback()
        return False, "Usuário ou email já cadastrado"
    except Exception as e:
        return False, str(e)
    finally:
        conn.close()

def create_folder(user_id, name):
    conn = get_connection()
    if not conn:
        return False, "Erro na conexão com o banco"

    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO folders (user_id, name) VALUES (%s, %s) RETURNING id
        """, (user_id, name))
        folder_id = cur.fetchone()[0]
        conn.commit()
        cur.close()
        return True, folder_id
    except Exception as e:
        conn.rollback()
        return False, str(e)
    finally:
        conn.close()

def get_folders_by_user(user_id):
    conn = get_connection()
    if not conn:
        return []

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT id, name FROM folders WHERE user_id = %s
        """, (user_id,))
        folders = cur.fetchall()
        cur.close()
        return folders
    except Exception as e:
        print(f"Erro ao buscar pastas: {e}")
        return []
    finally:
        conn.close()

def delete_folder(folder_id, user_id):
    conn = get_connection()
    if not conn:
        return False, "Erro na conexão com o banco"

    try:
        cur = conn.cursor()
        # Confere se a pasta pertence ao usuário
        cur.execute("""
            DELETE FROM folders WHERE id = %s AND user_id = %s
        """, (folder_id, user_id))
        conn.commit()
        cur.close()
        return True, "Pasta deletada com sucesso"
    except Exception as e:
        conn.rollback()
        return False, str(e)
    finally:
        conn.close()

def move_bookmark_to_folder(bookmark_id, folder_id, user_id):
    conn = get_connection()
    if not conn:
        return False, "Erro na conexão com o banco"

    try:
        cur = conn.cursor()
        # Confere se a pasta pertence ao usuário
        cur.execute("""
            SELECT id FROM folders WHERE id = %s AND user_id = %s
        """, (folder_id, user_id))
        folder = cur.fetchone()
        if not folder:
            return False, "Pasta não encontrada ou não pertence ao usuário"

        # Atualiza o bookmark
        cur.execute("""
            UPDATE bookmarks SET folder_id = %s WHERE id = %s AND user_id = %s
        """, (folder_id, bookmark_id, user_id))
        conn.commit()
        cur.close()
        return True, "Bookmark movido para a pasta com sucesso"
    except Exception as e:
        conn.rollback()
        return False, str(e)
    finally:
        conn.close()

def get_bookmarks_by_folder(folder_id, user_id):
    conn = get_connection()
    if not conn:
        return []

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT id, title, url, description FROM bookmarks
            WHERE folder_id = %s AND user_id = %s
        """, (folder_id, user_id))
        bookmarks = cur.fetchall()
        cur.close()
        return bookmarks
    except Exception as e:
        print(f"Erro ao buscar bookmarks da pasta: {e}")
        return []
    finally:
        conn.close()

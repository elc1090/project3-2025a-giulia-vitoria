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

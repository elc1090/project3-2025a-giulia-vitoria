import psycopg2
import os
from dotenv import load_dotenv

# Carrega as variáveis do .env (funciona localmente)
load_dotenv()

def get_connection():
    try:
        # Se estiver no Render, ele usa DATABASE_URL diretamente
        database_url = os.getenv("DATABASE_URL")
        if database_url:
            conn = psycopg2.connect(database_url)
        else:
            # Fallback para ambiente local (usando variáveis separadas)
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
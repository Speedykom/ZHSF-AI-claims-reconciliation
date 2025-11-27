import psycopg
import os

db_name = os.getenv("TEST_DB", "test_db")
db_user = os.getenv("TEST_DB_USER", "test")
db_password = os.getenv("TEST_DB_PASSWORD", "pass")
db_host = os.getenv("TEST_DB_HOST", "test-db")
db_port = os.getenv("TEST_DB_PORT", "5432")

conn = psycopg.connect(f"dbname={db_name} user={db_user} password={db_password} host={db_host} port={db_port}")
cur = conn.cursor()

# function to execute a query
def execute_query(query: str):
    cur.execute(query)
    return cur.fetchall()

# function to close the connection
def close_connection():
    cur.close()
    conn.close()

from pyodbc import Connection, Cursor


def close_cxn(conn: Connection, cursor: Cursor):
    if cursor:
        cursor.close()
    if conn:
        conn.close()

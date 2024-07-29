from fastapi import FastAPI
import pyodbc
import os
from dotenv import load_dotenv

from req_schemas import AccountAddSchema, EnvelopeAddSchema, TransactionAddSchema
from models import (
    Account,
    Envelope,
    ListResponse,
    ScalarResponse,
)

load_dotenv()

app = FastAPI()


driver = os.getenv("DRIVER")
server = os.getenv("SERVER")
db = os.getenv("DATABASE")
username = os.getenv("USER_NAME")
password = os.getenv("PASSWORD")
conn_str = (
    f"DRIVER={{{driver}}};SERVER={server};DATABASE={db};UID={username};PWD={password}"
)


@app.get("/accounts")
async def get_accounts():
    user_id = 1
    res: ListResponse = None
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cmd = "SELECT * FROM dbo.[account] WHERE user_id = ?"

        cursor.execute(cmd, user_id)
        rows = cursor.fetchall()
        res = ListResponse(
            "SUCCESS", "User accounts retrieved", [Account(row=row) for row in rows]
        )
    except pyodbc.Error as e:
        print(f"Error: {e}")
        res = ScalarResponse("ERROR", f"{e}")
    finally:
        conn.close()
        return res


@app.post("/accounts")
async def create_account(account: AccountAddSchema):
    user_id = 1
    res: ListResponse = None
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cmd = "INSERT INTO dbo.[account] VALUES(?, ?, ?, CURRENT_TIMESTAMP)"

        params = [user_id, account.name, account.amount]
        cursor.execute(cmd, params)
        print()
        cursor.commit()

        res = ScalarResponse("SUCCESS", "Account created")
    except pyodbc.Error as e:
        print(f"Error: {e}")
        res = ScalarResponse("ERROR", f"{e}")
    finally:
        if conn:
            conn.close()
        return res


@app.post("/envelopes")
def create_envelope(envelope: EnvelopeAddSchema):
    res: ListResponse = None
    try:
        if envelope.type not in ["need", "expense", "spending"]:
            raise Exception("Envelope type invalid. Choose: need, expense, spending")

        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cmd = "INSERT INTO dbo.[envelope] VALUES(?, ?, ?, ?, ?)"
        params = [
            envelope.account_id,
            envelope.title,
            envelope.fill,
            envelope.fill,
            envelope.type,
        ]
        cursor.execute(cmd, params)
        cursor.commit()

        res = ScalarResponse("SUCCESS", "Envelope created")
    except pyodbc.Error as e:
        print(f"Error: {e}")
        res = ScalarResponse("ERROR", f"{e}")
    finally:
        if conn:
            conn.close()
        return res


@app.get("/envelopes")
def get_envelopes():
    user_id = 1
    res: ListResponse = None
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cmd = """
            SELECT * 
            FROM dbo.[envelope]
            JOIN dbo.
            """

        cursor.execute(cmd, user_id)
        rows = cursor.fetchall()
        res = ListResponse(
            "SUCCESS", "User envelopes retrieved", [Envelope(row=row) for row in rows]
        )
    except pyodbc.Error as e:
        print(f"Error: {e}")
        res = ScalarResponse("ERROR", f"{e}")
    finally:
        conn.close()
        return res


@app.post("/transactions")
def create_envelope(transaction: TransactionAddSchema):
    res: ListResponse = None
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cmd = "INSERT INTO dbo.[transaction] VALUES(?, ?, ?, ?)"
        params = [
            transaction.payee,
            transaction.amount,
            transaction.envelope_id,
            transaction.envelope_id,
        ]
        cursor.execute(cmd, params)
        cursor.commit()

        res = ScalarResponse("SUCCESS", "Transaction created")
    except pyodbc.Error as e:
        print(f"Error: {e}")
        res = ScalarResponse("ERROR", f"{e}")
    finally:
        if conn:
            conn.close()
        return res


@app.get("/transactions")
def get_envelopes():
    user_id = 1
    res: ListResponse = None
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cmd = "SELECT * FROM dbo.[envelope] WHERE user_id = ?"

        cursor.execute(cmd, user_id)
        rows = cursor.fetchall()
        res = ListResponse(
            "SUCCESS", "User envelopes retrieved", [Envelope(row=row) for row in rows]
        )
    except pyodbc.Error as e:
        print(f"Error: {e}")
        res = ScalarResponse("ERROR", f"{e}")
    finally:
        conn.close()
        return res

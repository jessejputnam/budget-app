from fastapi import FastAPI
import pyodbc

from functions.startup_code import get_conn_string
from functions.lib import close_cxn
from schema.req_schemas import (
    AccountAddSchema,
    EnvelopeAddSchema,
    TransactionAddSchema,
    TransferAddSchema,
)
from models.db_models import Account, Envelope, Transaction, Transfer
from models.res_models import ListResponse, ScalarResponse, VoidResponse

app = FastAPI()

conn_str = get_conn_string()


@app.get("/accounts")
async def get_accounts():
    user_id = 1
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cmd = "SELECT * FROM [dbo].[account] WHERE user_id = ?"

        cursor.execute(cmd, user_id)
        rows = cursor.fetchall()

        data = [Account(*row) for row in rows]
        res = ListResponse("SUCCESS", "User accounts retrieved", data)
    except pyodbc.Error as e:
        print(f"Error: {e}")
        res = ListResponse("ERROR", f"{e}")
    except Exception as e:
        print(f"Error: {e}")
        res = ListResponse("ERROR", f"{e}")
    finally:
        close_cxn(conn, cursor)
        return res


@app.post("/accounts")
async def create_account(account: AccountAddSchema):
    user_id = 1
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cmd = "INSERT INTO [dbo].[account] VALUES(?, ?, ?, CURRENT_TIMESTAMP)"

        params = [user_id, account.name, account.amount]
        cursor.execute(cmd, params)
        cursor.commit()

        res = VoidResponse("SUCCESS", "Account created")
    except pyodbc.Error as e:
        print(f"Error: {e}")
        cursor.rollback()
        res = VoidResponse("ERROR", f"{e}")
    except Exception as e:
        print(f"Error: {e}")
        res = ListResponse("ERROR", f"{e}")
    finally:
        close_cxn(conn, cursor)
        return res


@app.post("/envelopes")
def create_envelope(env: EnvelopeAddSchema):
    try:
        if env.type not in ["need", "expense", "spending"]:
            raise Exception("Envelope type invalid. Choose: need, expense, spending")

        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cmd = "INSERT INTO [dbo].[envelope] VALUES(?, ?, ?, ?, ?)"
        params = [env.account_id, env.title, env.fill, env.fill, env.type]
        cursor.execute(cmd, params)
        cursor.commit()

        res = VoidResponse("SUCCESS", "Envelope created")
    except pyodbc.Error as e:
        print(f"Error: {e}")
        cursor.rollback()
        res = VoidResponse("ERROR", f"{e}")
    except Exception as e:
        print(f"Error: {e}")
        res = ListResponse("ERROR", f"{e}")
    finally:
        close_cxn(conn, cursor)
        return res


@app.get("/envelopes")
def get_envelopes():
    user_id = 1
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cmd = """
            SELECT e.* 
            FROM [dbo].[envelope] e
            JOIN [dbo].[account] a ON e.[account_id] = a.[id]
            WHERE a.[user_id] = ?
            """

        cursor.execute(cmd, user_id)
        rows = cursor.fetchall()
        data = [Envelope(*row) for row in rows]

        res = ListResponse("SUCCESS", "User envelopes retrieved", data)
    except pyodbc.Error as e:
        print(f"Error: {e}")
        res = ListResponse("ERROR", f"{e}")
    finally:
        close_cxn(conn, cursor)
        return res


@app.post("/transactions")
def create_transaction(transaction: TransactionAddSchema):
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cmd = "INSERT INTO [dbo].[transaction] VALUES(?, ?, ?, CURRENT_TIMESTAMP)"
        params = [
            transaction.payee,
            transaction.amount,
            transaction.envelope_id,
        ]
        cursor.execute(cmd, params)

        cmd = """
            UPDATE [dbo].[envelope]
            SET [amount] = [amount] - ?, []
            WHERE [id] = ?
            """
        params = [transaction.amount, transaction.envelope_id]
        cursor.execute(cmd, params)

        cmd = """
            UPDATE [dbo].[account] 
            SET [amount] = [amount] - ?, [last_updated] = CURRENT_TIMESTAMP 
            WHERE [id] = (
                SELECT [account_id] 
                FROM [dbo].[envelope]
                WHERE [id] = ?
            )
            """
        cursor.execute(cmd, params)
        cursor.commit()

        res = VoidResponse("SUCCESS", "Transaction created")
    except pyodbc.Error as e:
        print(f"Error: {e}")
        cursor.rollback()
        res = VoidResponse("ERROR", f"{e}")
    finally:
        close_cxn(conn, cursor)
        return res


@app.get("/transactions")
def get_transactions():
    user_id = 1
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cmd = """
            SELECT t.* 
            FROM [dbo].[transaction] t
            JOIN [dbo].[envelope] e ON t.[envelope_id] = e.[id]
            JOIN [dbo].[account] a ON e.[account_id] = a.[id]
            WHERE a.[user_id] = ?
            """

        cursor.execute(cmd, user_id)
        rows = cursor.fetchall()
        data = [Transaction(*row) for row in rows]
        res = ListResponse("SUCCESS", "User transactions retrieved", data)
    except pyodbc.Error as e:
        print(f"Error: {e}")
        res = ListResponse("ERROR", f"{e}")
    finally:
        close_cxn(conn, cursor)
        return res


@app.post("/transfers")
def create_transfer(transfer: TransferAddSchema):
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cmd = "INSERT INTO [dbo].[transfer] VALUES(?, ?, ?, CURRENT_TIMESTAMP)"
        params = [
            transfer.from_account_id,
            transfer.to_account_id,
            transfer.amount,
        ]
        cursor.execute(cmd, params)

        cmd = """
            UPDATE [dbo].[account] 
            SET [amount] = [amount] - ?, [last_updated] = CURRENT_TIMESTAMP 
            WHERE [id] = ?
            """
        params = [transfer.amount, transfer.from_account_id]
        cursor.execute(cmd, params)

        cmd = """
            UPDATE [dbo].[account] 
            SET [amount] = [amount] + ?, [last_updated] = CURRENT_TIMESTAMP 
            WHERE [id] = ?
            """
        params = [transfer.amount, transfer.to_account_id]
        cursor.execute(cmd, params)

        cursor.commit()

        res = VoidResponse("SUCCESS", "Transfer created")
    except pyodbc.Error as e:
        print(f"Error: {e}")
        cursor.rollback()
        res = VoidResponse("ERROR", f"{e}")
    finally:
        close_cxn(conn, cursor)
        return res


@app.get("/transfers")
def get_transfers():
    user_id = 1
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cmd = """
            SELECT t.* 
            FROM [dbo].[transfer] t
            JOIN [dbo].[account] a ON t.[from_account_id] = a.[id]
            WHERE a.[user_id] = ?
            """

        cursor.execute(cmd, user_id)
        rows = cursor.fetchall()

        data = [Transfer(*row) for row in rows]
        res = ListResponse("SUCCESS", "User transfers retrieved", data)
    except pyodbc.Error as e:
        print(f"Error: {e}")
        res = ListResponse("ERROR", f"{e}")
    finally:
        close_cxn(conn, cursor)
        return res

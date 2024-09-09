from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pyodbc

from functions.startup_code import get_conn_string
from functions.lib import close_cxn
from functions import sql
from schema.req_schemas import (
    EnvelopeAddSchema,
    EnvelopeEditSchema,
    TransactionAddSchema,
    EnvelopeTransferAddSchema,
)
from models.db_models import Envelope, Transaction
from models.res_models import ListResponse, VoidResponse

app = FastAPI()

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conn_str = get_conn_string()
conn = None


@app.post("/envelopes")
def create_envelope(env: EnvelopeAddSchema):
    try:
        if env.type not in ["bill", "expense", "spending", "debt"]:
            raise Exception("Envelope type must be bill, expense, spending, or debt")

        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cmd = sql.envelope_insert_one()
        params = [env.user_id, env.title, env.fill, env.fill, env.type]
        cursor.execute(cmd, params)
        cursor.commit()

        res = VoidResponse("SUCCESS", 200, "Envelope created")
    except pyodbc.Error as e:
        print(f"Error: {e}")
        cursor.rollback()
        res = VoidResponse("ERROR", 500, f"{e}")
    except Exception as e:
        print(f"Error: {e}")
        res = VoidResponse("ERROR", 500, f"{e}")
    finally:
        if conn is not None:
            close_cxn(conn, cursor)
        return res


@app.get("/envelopes")
def get_envelopes():
    user_id = 1
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cmd = sql.envelope_get_all()

        cursor.execute(cmd, user_id)
        rows = cursor.fetchall()
        data = [Envelope(*row) for row in rows]

        res = ListResponse("SUCCESS", 200, "User envelopes retrieved", data)
    except pyodbc.Error as e:
        print(f"Error: {e}")
        res = ListResponse("ERROR", 500, f"{e}")
    finally:
        if conn is not None:
            close_cxn(conn, cursor)
        return res


@app.delete("/envelopes/{id}")
def del_envelope(id: int):
    user_id = 1
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cmd = sql.envelope_delete_one()
        params = [id]
        cursor.execute(cmd, params)
        cursor.commit()

        res = VoidResponse("SUCCESS", 200, f"Envelope with id <{id}> deleted")
    except pyodbc.Error as e:
        print(f"Error: {e}")
        cursor.rollback()
        res = VoidResponse("ERROR", 500, f"{e}")
    except Exception as e:
        print(f"Error: {e}")
        res = VoidResponse("ERROR", 500, f"{e}")
    finally:
        if conn is not None:
            close_cxn(conn, cursor)
        return res


@app.patch("/envelopes/{id}")
def update_envelope(envelope: EnvelopeEditSchema):
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()

        cmd = sql.envelope_update()
        params = [envelope.title, envelope.fill, envelope.type, envelope.id]
        print(f"\n\n{cmd}\n\n{params}\n\n")
        cursor.execute(cmd, params)
        cursor.commit()
        res = VoidResponse("SUCCESS", 200, f"Envelope with id <{id}> updated")
    except pyodbc.Error as e:
        print(f"Error: {e}")
        cursor.rollback()
        res = VoidResponse("ERROR", 500, f"{e}")
    except Exception as e:
        print(f"Error: {e}")
        res = VoidResponse("ERROR", 500, f"{e}")
    finally:
        if conn is not None:
            close_cxn(conn, cursor)
        return res


@app.post("/transactions")
def create_transaction(transaction: TransactionAddSchema):
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cmd = sql.transaction_insert()

        params = [transaction.payee, transaction.amount, transaction.envelope_id]
        cursor.execute(cmd, params)

        cmd = sql.envelope_subtract()
        params = [transaction.amount, transaction.envelope_id]
        cursor.execute(cmd, params)

        cursor.commit()

        res = VoidResponse("SUCCESS", 200, "Transaction created")
    except pyodbc.Error as e:
        print(f"Error: {e}")
        cursor.rollback()
        res = VoidResponse("ERROR", 500, f"{e}")
    finally:
        close_cxn(conn, cursor)
        return res


@app.get("/transactions")
def get_transactions():
    user_id = 1
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cmd = sql.transaction_select_all()

        cursor.execute(cmd, user_id)
        rows = cursor.fetchall()
        data = [Transaction(*row) for row in rows]
        res = ListResponse("SUCCESS", 200, "User transactions retrieved", data)
    except pyodbc.Error as e:
        print(f"Error: {e}")
        res = ListResponse("ERROR", 500, f"{e}")
    finally:
        close_cxn(conn, cursor)
        return res


@app.post("/transfers")
def create_transfer(transfer: EnvelopeTransferAddSchema):
    try:
        conn = pyodbc.connect(conn_str)
        cursor = conn.cursor()
        cmd = sql.envelope_transfer_insert()

        params = [transfer.from_envelope_id, transfer.to_envelope_id, transfer.amount]
        cursor.execute(cmd, params)

        cmd = sql.envelope_subtract()
        params = [transfer.amount, transfer.from_envelope_id]
        cursor.execute(cmd, params)

        cmd = sql.envelope_add()
        params = [transfer.amount, transfer.to_envelope_id]
        cursor.execute(cmd, params)

        cursor.commit()

        res = VoidResponse("SUCCESS", 200, "Transfer created")
    except pyodbc.Error as e:
        print(f"Error: {e}")
        cursor.rollback()
        res = VoidResponse("ERROR", 500, f"{e}")
    finally:
        close_cxn(conn, cursor)
        return res

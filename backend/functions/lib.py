from pyodbc import Connection, Cursor


def close_cxn(conn: Connection, cursor: Cursor):
    try:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
    except Exception as e:
        raise Exception(e)


def get_sql_cmd(sql_call: str):
    match sql_call:
        case "account_select_all":
            return "SELECT * FROM [dbo].[account] WHERE user_id = ?"

        case "account_insert":
            return "INSERT INTO [dbo].[account] VALUES(?, ?, ?, CURRENT_TIMESTAMP)"

        case "envelope_insert":
            return "INSERT INTO [dbo].[envelope] VALUES(?, ?, ?, ?, ?)"

        case "envelope_select_all":
            return """
            SELECT e.* 
            FROM [dbo].[envelope] e
            JOIN [dbo].[account] a ON e.[account_id] = a.[id]
            WHERE a.[user_id] = ?
            """

        case "transaction_insert":
            return "INSERT INTO [dbo].[transaction] VALUES(?, ?, ?, CURRENT_TIMESTAMP)"

        case "envelope_sub":
            return """
            UPDATE [dbo].[envelope]
            SET [amount] = [amount] - ?, []
            WHERE [id] = ?
            """

        case "account_sub_by_envelope":
            return """
            UPDATE [dbo].[account] 
            SET [amount] = [amount] - ?, [last_updated] = CURRENT_TIMESTAMP 
            WHERE [id] = (
                SELECT [account_id] 
                FROM [dbo].[envelope]
                WHERE [id] = ?
            )
            """

        case "transaction_select_all":
            return """
            SELECT t.* 
            FROM [dbo].[transaction] t
            JOIN [dbo].[envelope] e ON t.[envelope_id] = e.[id]
            JOIN [dbo].[account] a ON e.[account_id] = a.[id]
            WHERE a.[user_id] = ?
            """

        case "transfer_insert":
            return "INSERT INTO [dbo].[transfer] VALUES(?, ?, ?, CURRENT_TIMESTAMP)"

        case "account_sub_by_id":
            return """
            UPDATE [dbo].[account] 
            SET [amount] = [amount] - ?, [last_updated] = CURRENT_TIMESTAMP 
            WHERE [id] = ?
            """

        case "account_add_by_id":
            return """
            UPDATE [dbo].[account] 
            SET [amount] = [amount] + ?, [last_updated] = CURRENT_TIMESTAMP 
            WHERE [id] = ?
            """

        case "transfer_select_all":
            return """
            SELECT t.* 
            FROM [dbo].[transfer] t
            JOIN [dbo].[account] a ON t.[from_account_id] = a.[id]
            WHERE a.[user_id] = ?
            """
        case _:
            raise Exception("Unrecognized SQL call")

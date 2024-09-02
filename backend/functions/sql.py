def envelope_insert_one():
    return """
        INSERT INTO [dbo].[account_envelope] (
            ae_ua_id, 
            ae_title, 
            ae_amount, 
            ae_fill, 
            ae_type
        )
        VALUES (?, ?, ?, ?, ?)
        """


def envelope_delete_one():
    return """
        DELETE FROM [dbo].[account_envelope]
        WHERE [ae_id] = ?
    """


def envelope_get_all():
    return """
        SELECT * 
        FROM [dbo].[account_envelope]
        WHERE [ae_ua_id] = ?
        """


def envelope_transfer_insert():
    return """
        INSERT INTO [dbo].[envelope_amount_transfer] (
            eat_from_ae_id, 
            eat_to_ae_id, 
            eat_transfer_amount, 
            eat_timestamp
        )
        VALUES(?, ?, ?, CURRENT_TIMESTAMP)
        """


def transaction_insert():
    return """
        INSERT INTO [dbo].[envelope_transaction] (et_payee, et_amount, et_ae_id, et_timestamp)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
        """


def transaction_select_all():
    return """
        SELECT t.* 
        FROM [dbo].[envelope_transaction] et
        JOIN [dbo].[account_envelope] ae ON et.[et_ae_id] = ae.[ae_id]
        WHERE ae.[ae_ua_id] = ?
        """


def envelope_subtract():
    return """
        UPDATE [dbo].[account_envelope]
        SET [ae_amount] = [ae_amount] - ?
        WHERE [ae_id] = ?
        """


def envelope_add():
    return """
        UPDATE [dbo].[account_envelope]
        SET [ae_amount] = [ae_amount] + ?
        WHERE [ae_id] = ?
        """

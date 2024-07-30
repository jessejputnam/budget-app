from models.db_models import Account, User, Transaction, Envelope, Transfer


class ListResponse:
    status: str
    message: str
    data: (
        list[Account]
        | list[User]
        | list[Transaction]
        | list[Envelope]
        | list[Transfer]
        | None
    )

    def __init__(self, status: str, message: str, data: list[object] = None):
        self.status = status
        self.message = message
        self.data = data


class ScalarResponse:
    status: str
    message: str
    data: Account | User | Transaction | Envelope | Transfer | str | None

    def __init__(self, status: str, message: str, data: object = None):
        self.status = status
        self.message = message
        self.data = data


class VoidResponse:
    status: str
    message: str

    def __init__(self, status: str, message: str):
        self.status = status
        self.message = message

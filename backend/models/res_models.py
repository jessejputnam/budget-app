from models.db_models import User, Transaction, Envelope, EnvelopeTransfer


class ListResponse:
    status: str
    message: str
    data: (
        list[User] | list[Transaction] | list[Envelope] | list[EnvelopeTransfer] | None
    )

    def __init__(self, status: str, message: str, data: list[object] = None):
        self.status = status
        self.message = message
        self.data = data


class ScalarResponse:
    status: str
    message: str
    data: User | Transaction | Envelope | EnvelopeTransfer | str | None

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

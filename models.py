from datetime import datetime


class User:
    id: int
    fname: str
    lname: str
    username: str
    password: str
    last_login: datetime

    def __init__(self, id, fname, lname, username, password, last_login):
        self.id = id
        self.fname = fname
        self.lname = lname
        self.username = username
        self.password = password
        self.last_login = last_login


class Account:
    id: int
    user_id: int
    name: str
    amount: float
    last_updated: datetime

    def __init__(
        self,
        id: int | None = None,
        user_id: int | None = None,
        name: str | None = None,
        amount: float | None = None,
        last_updated: datetime | None = None,
        row: list[any] | None = None,
    ):
        if row is None:
            self.id = id
            self.user_id = user_id
            self.name = name
            self.amount = amount
            self.last_updated = last_updated
        else:
            self.id = row[0]
            self.user_id = row[1]
            self.name = row[2]
            self.amount = row[3]
            self.last_update = row[4]


class Envelope:
    id: int
    account_id: int
    title: str
    amount: float
    fill: float
    type: str

    def __init__(
        self,
        id: int | None = None,
        account_id: int | None = None,
        title: str | None = None,
        amount: float | None = None,
        fill: float | None = None,
        type: str | None = None,
        row: list[any] | None = None,
    ):
        if row is None:
            self.id = id
            self.account_id = account_id
            self.title = title
            self.amount = amount
            self.fill = fill
            self.type = type
        else:
            self.id = row[0]
            self.account_id = row[1]
            self.title = row[2]
            self.amount = row[3]
            self.fill = row[4]
            self.type = row[5]


class Transaction:
    id: int
    payee: str
    amount: float
    envelope_id: int
    account_id: int
    timestamp: datetime

    def __init__(self, id, payee, amount, envelope_id, account_id, timestamp):
        self.id = id
        self.payee = payee
        self.amount = amount
        self.envelope_id = envelope_id
        self.account_id = account_id
        self.timestamp = timestamp


class Transfer:
    id: int
    from_account_id: int
    to_account_id: int
    amount: float
    timestamp: datetime

    def __init__(self, id, from_account_id, to_account_id, amount, timestamp):
        self.id = id
        self.from_account_id = from_account_id
        self.to_acount_id = to_account_id
        self.amount = amount
        self.timestamp = timestamp


class ListResponse:
    status: str
    message: str
    data: list[Account] | list[User] | list[Transaction] | list[Envelope] | None

    def __init__(self, status, message, data=None):
        self.status = status
        self.message = message
        self.data = data


class ScalarResponse:
    status: str
    message: str
    data: Account | User | Transaction | Envelope | str | None

    def __init__(self, status, message, data=None):
        self.status = status
        self.message = message
        self.data = data

from datetime import datetime


class User:
    id: int
    fname: str
    lname: str
    username: str
    password: str
    last_login: datetime

    def __init__(
        self,
        id: int,
        fname: str,
        lname: str,
        username: str,
        password: str,
        last_login: datetime,
    ):
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
        id: int,
        user_id: int,
        name: str,
        amount: float,
        last_updated: datetime,
    ):
        self.id = id
        self.user_id = user_id
        self.name = name
        self.amount = amount
        self.last_updated = last_updated


class Envelope:
    id: int
    account_id: int
    title: str
    amount: float
    fill: float
    type: str

    def __init__(
        self,
        id: int,
        account_id: int,
        title: str,
        amount: float,
        fill: float,
        type: str,
    ):
        self.id = id
        self.account_id = account_id
        self.title = title
        self.amount = amount
        self.fill = fill
        self.type = type


class Transaction:
    id: int
    payee: str
    amount: float
    envelope_id: int
    account_id: int
    timestamp: datetime

    def __init__(
        self, id: int, payee: str, amount: float, envelope_id: int, timestamp: datetime
    ):
        self.id = id
        self.payee = payee
        self.amount = amount
        self.envelope_id = envelope_id
        self.timestamp = timestamp


class Transfer:
    id: int
    from_account_id: int
    to_account_id: int
    amount: float
    timestamp: datetime

    def __init__(
        self,
        id: int,
        from_account_id: int,
        to_account_id: int,
        amount: float,
        timestamp: datetime,
    ):
        self.id = id
        self.from_account_id = from_account_id
        self.to_acount_id = to_account_id
        self.amount = amount
        self.timestamp = timestamp

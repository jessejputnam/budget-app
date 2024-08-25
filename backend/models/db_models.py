from datetime import datetime


class User:
    ua_id: int
    ua_fname: str
    ua_lname: str
    ua_username: str
    ua_password: str
    ua_last_login: datetime

    def __init__(
        self,
        ua_id: int,
        ua_fname: str,
        ua_lname: str,
        ua_username: str,
        ua_password: str,
        ua_last_login: datetime,
    ):
        self.ua_id = ua_id
        self.ua_fname = ua_fname
        self.ua_lname = ua_lname
        self.ua_username = ua_username
        self.ua_password = ua_password
        self.ua_last_login = ua_last_login


class Envelope:
    ae_id: int
    ae_ua_id: int
    ae_title: str
    ae_amount: float
    ae_fill: float
    ae_type: str

    def __init__(
        self,
        ae_id: int,
        ae_ua_id: int,
        ae_title: str,
        ae_amount: float,
        ae_fill: float,
        ae_type: str,
    ):
        self.ae_id = ae_id
        self.ae_ua_id = ae_ua_id
        self.ae_title = ae_title
        self.ae_amount = ae_amount
        self.ae_fill = ae_fill
        self.ae_type = ae_type


class Transaction:
    et_id: int
    et_payee: str
    et_amount: float
    et_ae_id: int
    et_timestamp: datetime

    def __init__(
        self,
        et_id: int,
        et_payee: str,
        et_amount: float,
        et_ae_id: int,
        et_timestamp: datetime,
    ):
        self.et_id = et_id
        self.et_payee = et_payee
        self.et_amount = et_amount
        self.et_envelope_id = et_ae_id
        self.et_timestamp = et_timestamp


class EnvelopeTransfer:
    eat_id: int
    eat_from_ae_id: int
    eat_to_ae_id: int
    eat_transfer_amount: float
    eat_timestamp: datetime

    def __init__(
        self,
        eat_id: int,
        eat_from_ae_id: int,
        eat_to_ae_id: int,
        eat_transfer_amount: float,
        eat_timestamp: datetime,
    ):
        self.eat_id = eat_id
        self.eat_from_ae_id = eat_from_ae_id
        self.eat_to_ae_id = eat_to_ae_id
        self.eat_transfer_amount = eat_transfer_amount
        self.eat_timestamp = eat_timestamp

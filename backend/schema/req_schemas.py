from pydantic import BaseModel


class AccountAddSchema(BaseModel):
    name: str
    amount: float


class EnvelopeAddSchema(BaseModel):
    account_id: int
    title: str
    fill: float
    type: str


class TransactionAddSchema(BaseModel):
    payee: str
    amount: float
    envelope_id: int


class TransferAddSchema(BaseModel):
    from_account_id: int
    to_account_id: int
    amount: float

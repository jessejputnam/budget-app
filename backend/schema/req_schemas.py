from pydantic import BaseModel


class EnvelopeAddSchema(BaseModel):
    user_id: int
    title: str
    fill: float
    type: str


class EnvelopeEditSchema(BaseModel):
    id: int
    user_id: int
    title: str
    fill: float
    type: str


class TransactionAddSchema(BaseModel):
    payee: str
    amount: float
    envelope_id: int


class EnvelopeTransferAddSchema(BaseModel):
    from_envelope_id: int
    to_envelope_id: int
    amount: float

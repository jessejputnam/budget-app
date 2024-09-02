// REACT PROPS
export type EditEnvelopeProp = {
    envelope: Envelope
    setDelEnvelope: React.Dispatch<React.SetStateAction<Envelope | null>>
}

export type EnvelopeProp = {
    title: string
    amount: number
    fill: number
}

export type AddEnvelopeModalProps = {
    setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    setError: React.Dispatch<React.SetStateAction<string | null>>
    setEnvelopes: React.Dispatch<React.SetStateAction<Envelope[]>>
}

export type DelEnvelopeModalProps = {
    delEnvelope: Envelope | null
    setDelEnvelope: React.Dispatch<React.SetStateAction<Envelope | null>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    setError: React.Dispatch<React.SetStateAction<string | null>>
    setEnvelopes: React.Dispatch<React.SetStateAction<Envelope[]>>
}

export type AlertProps = {
    msg: string
}

export type ButtonProps = {
    onClick: React.MouseEventHandler<HTMLButtonElement> | undefined
    disabled?: boolean | undefined
    text: string
}


// FUNCTION ARGS
export type EditEnvelopeSectionArgs = {
    envelopes: Array<Envelope>
    type: string
    setDelEnvelope: React.Dispatch<React.SetStateAction<Envelope | null>>
}

export type EnvelopeSectionArgs = {
    envelopes: Array<Envelope>
    type: string
}

// CLASSES
export type Envelope = {
    ae_id: number
    ae_ua_id: number
    ae_title: string
    ae_amount: number
    ae_fill: number
    ae_type: string
}

export type Debt = {
    id: number
    name: string
    amount: number
    interest: number
}

// API
type ApiStructure<T> = {
    status: string
    message: string
    data: T[]
}

export type ApiRes<T> = [string | null, ApiStructure<T> | null];
import { Envelope } from "../Classes/Envelope"

export type EditEnvelopeSectionArgs = {
    envelopes: Array<Envelope>
    type: string
    setDelEnvelope: React.Dispatch<React.SetStateAction<Envelope | null>>
}

export type EnvelopeSectionArgs = {
    envelopes: Array<Envelope>
    type: string
}

// API
type ApiStructure<T> = {
    status: string
    message: string
    data: T[]
}

export type ApiRes<T> = [string | null, ApiStructure<T> | null];
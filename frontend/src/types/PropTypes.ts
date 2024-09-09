import { Envelope } from "../Classes/Envelope"

export type EditEnvelopeProp = {
    envelope: Envelope
    setDelEnvelope: React.Dispatch<React.SetStateAction<Envelope | null>>
    setEditEnvelope: React.Dispatch<React.SetStateAction<Envelope | null>>
}

export type EnvelopeProp = {
    envelope: Envelope
}

export type EnvelopeSectionProps = {
    envelopes: Envelope[] | null
    type: string
    isEdit?: boolean
    setDelEnvelope?: React.Dispatch<React.SetStateAction<Envelope | null>>
    setEditEnvelope?: React.Dispatch<React.SetStateAction<Envelope | null>>
}


export type AddEnvelopeModalProps = {
    setAddEnvelope: React.Dispatch<React.SetStateAction<boolean>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    setError: React.Dispatch<React.SetStateAction<string | null>>
    setEnvelopes: React.Dispatch<React.SetStateAction<Envelope[]>>
}

export type EditEnvelopeModalProps = {
    editEnvelope: Envelope | null
    setEditEnvelope: React.Dispatch<React.SetStateAction<Envelope | null>>
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

export type ButtonRefreshEnvelopesProps = {
    setEnvelopes: React.Dispatch<React.SetStateAction<Envelope[]>>
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    setError: React.Dispatch<React.SetStateAction<string | null>>
}
// import React from "react";
export type EditEnvelopeProp = {
    title: string
    fill: number
}

export type EnvelopeProp = {
    title: string
    amount: number
    fill: number
}

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

export type AlertProp = {
    msg: string
}

type ApiStructure<T> = {
    status: string
    message: string
    data: T[]
}

export type ApiRes<T> = [string | null, ApiStructure<T> | null];
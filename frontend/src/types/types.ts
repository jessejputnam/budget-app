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
    id: number
    account_id: number
    title: string
    amount: number
    fill: number
    type: string
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
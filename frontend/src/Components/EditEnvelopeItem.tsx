// import { useState } from 'react'
import { EditEnvelopeProp } from "../Types/types"

export function EditEnvelopeItem({ title, fill }: EditEnvelopeProp) {
    return (
        <>
            <h5>{title}</h5>
            <p>Total: {fill}</p>
        </>
    )
}
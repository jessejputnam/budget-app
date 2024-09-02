// import { useState } from 'react'
import { EditEnvelopeProp } from "../Types/types"

export function EditEnvelopeItem({ envelope, setDelEnvelope }: EditEnvelopeProp) {
    return (
        <div className="flex gap-10">
            <p
                className="text-red-700 hover:cursor-pointer"
                onClick={() => setDelEnvelope(envelope)}>
                𝕏
            </p>
            <h5>{decodeURIComponent(envelope.ae_title)}</h5>
            <p>Total: {envelope.ae_fill}</p>
        </div>
    )
}
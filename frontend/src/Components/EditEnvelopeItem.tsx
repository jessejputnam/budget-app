// import { useState } from 'react'
import { EditEnvelopeProp } from "../Types/types"

export function EditEnvelopeItem({ title, fill }: EditEnvelopeProp) {
    return (
        <div className="flex gap-10">
            <h5>{title}</h5>
            <p>Total: {fill}</p>
        </div>
    )
}
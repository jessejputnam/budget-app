// import { useState } from 'react'
import { EditEnvelopeProp } from "../Types/types"

export function EditEnvelopeItem({ envelope, setDelEnvelope }: EditEnvelopeProp) {
    return (
        <div className="w-5/6">
            <div className="border-t border-r border-b border-l border-gray-400 bg-white rounded-md p-4 flex justify-between">
                <p className="text-red-700 hover:cursor-pointer"
                    onClick={() => setDelEnvelope(envelope)}>
                    𝕏
                </p>
                <div className="w-1/3">
                    <h5>{decodeURIComponent(envelope.ae_title)}</h5>
                </div>
                <div className="w-1/3">
                    <p>Total: {envelope.ae_fill}</p>
                </div>
            </div>
        </div>
    )
}
// import { useState } from 'react'
import { EditEnvelopeProp } from "../Types/types"

const envelopeClass = "border-t border-r border-b border-l border-gray-400 bg-white rounded-md p-4 flex justify-between";

export function EditEnvelopeItem({ envelope, setDelEnvelope }: EditEnvelopeProp) {
    const handleDeleteClick = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
        e.stopPropagation();
        setDelEnvelope(envelope)
    }

    // const handleEditClick = (e) => {
    // }

    return (
        <div className="w-5/6">
            <div className={envelopeClass}>
                <p className="text-red-700 hover:cursor-pointer"
                    onClick={handleDeleteClick}>
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
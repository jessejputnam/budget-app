// import { useState } from 'react'
// import { Envelope } from "../Classes/Envelope";
import { EditEnvelopeProp } from "../Types/PropTypes";

const envelopeClass = "border-t border-r border-b border-l border-gray-400 bg-white rounded-md p-4 flex justify-between";

export function EditEnvelopeItem({ envelope, setDelEnvelope, setEditEnvelope }: EditEnvelopeProp) {
    const envTitle = envelope.title;
    const envFill = envelope.fill;

    const handleDeleteClick = (e: React.MouseEvent<HTMLParagraphElement, MouseEvent>) => {
        e.stopPropagation();
        setDelEnvelope(envelope)
    }

    const handleEditClick = () => {
        setEditEnvelope(envelope);
    }

    return (
        <div className="w-5/6">
            <div className={`${envelopeClass} hover:bg-slate-50`} onClick={handleEditClick}>
                <div>
                    <p className="text-red-800 font-extrabold hover:cursor-pointer hover:text-red-400 select-none text-justify"
                        onClick={handleDeleteClick}>
                        ×
                    </p>
                </div>
                <div className="w-1/3">
                    <h5>{decodeURIComponent(envTitle)}</h5>
                </div>
                <div className="w-1/3">
                    <p>Total: {envFill}</p>
                </div>
            </div>
        </div>
    )
}
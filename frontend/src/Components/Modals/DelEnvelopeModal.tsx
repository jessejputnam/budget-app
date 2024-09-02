import { modalBk, modalCard } from "../../lib/TailwindClass";
import { envelopeDeleteOne, envelopeGetAll } from "../../lib/Controller";
import { DelEnvelopeModalProps, Envelope } from "../../Types/types";
import { useState } from "react";
import { ButtonAction } from "../Buttons/ButtonAction";
import { ButtonCancel } from "../Buttons/ButtonCancel";

export function DelEnvelopeModal(props: DelEnvelopeModalProps) {
    const [disabled, setDisabled] = useState<boolean>(false);

    const handleDelEnvelope = async () => {
        setDisabled(true);

        if (!props.delEnvelope) {
            props.setError("Selected envelope has a null or undefined identification");
            props.setDelEnvelope(null);
            return;
        }

        const err = await envelopeDeleteOne(props.delEnvelope.ae_id)

        if (err) {
            props.setError(`Error deleting envelope: ${err}`);
            props.setDelEnvelope(null);
            return;
        }

        props.setLoading(true);
        const [e, data] = await envelopeGetAll<Envelope>();
        if (e) {
            props.setEnvelopes([]);
            props.setError(e);
        }
        else { props.setEnvelopes(data?.data ?? []) }

        props.setLoading(false);
        props.setDelEnvelope(null);
    }


    const handleCancelClick = () => { props.setDelEnvelope(null) };

    return (
        <div className={modalBk}>
            <div className={modalCard}>
                <div className="w-full">
                    <div className="m-8 my-20 max-w-[400px] mx-auto">
                        <div className="mb-8 flex flex-col gap-2">
                            <p>Delete envelope: {props.delEnvelope?.ae_title}?</p>
                        </div>
                        <div className="space-y-4">
                            <ButtonAction text="Delete Envelope" onClick={handleDelEnvelope} disabled={disabled} />
                            <ButtonCancel onClick={handleCancelClick} text="Cancel" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
import { useState } from "react";
import { Alert } from "../Alert";
import { modalBk, modalCard, text2 } from "../../lib/TailwindClass";
import { isValidEnvelopeTitle } from "../../lib/TextValidate";
import { envelopeAdd, envelopeGetAll } from "../../lib/Controller";
import { EditEnvelopeModalProps, Envelope } from "../../Types/types";
import { ButtonAction } from "../Buttons/ButtonAction";
import { ButtonCancel } from "../Buttons/ButtonCancel";


export function EditEnvelopeModal(props: EditEnvelopeModalProps) {
    const [newEnvelopeTitle, setNewEnvelopeTitle] = useState<string>(props.editEnvelope?.ae_title ?? "");
    const [newEnvelopeFill, setNewEnvelopeFill] = useState<string>(props.editEnvelope?.ae_fill.toString() ?? "0.00");
    const [newEnvelopeType, setNewEnvelopeType] = useState<string>(props.editEnvelope?.ae_type ?? "");
    const [editEnvMsg, setEditEnvMsg] = useState<string | null>(null);
    const [disabled, setDisabled] = useState<boolean>(false);

    const handleUpdateEnvelope = async () => {
        setDisabled(true);

        if (!isValidEnvelopeTitle(newEnvelopeTitle)) {
            setDisabled(false);
            setEditEnvMsg("Invalid envelope name.");
            setTimeout(() => setEditEnvMsg(null), 3000);
            return;
        }

        if (isNaN(Number(newEnvelopeFill)) || Number(newEnvelopeFill) <= 0) {
            setDisabled(false);
            setEditEnvMsg("Fill must be a valid monetary amount above $0.00.");
            setTimeout(() => setEditEnvMsg(null), 3000);
            return;
        }

        const err = await envelopeAdd(newEnvelopeTitle, Number(newEnvelopeFill), newEnvelopeType);
        if (err) {
            setDisabled(false);
            setEditEnvMsg(err)
            setTimeout(() => setEditEnvMsg(null), 3000);
        }

        props.setLoading(true);
        const [e, data] = await envelopeGetAll<Envelope>();

        if (e) { props.setEnvelopes([]); props.setError(e); }
        else { props.setEnvelopes(data?.data ?? []) }

        props.setLoading(false);
        props.setEditEnvelope(null);
    }


    const handleModalClick = () => { props.setEditEnvelope(null) };

    const handleFillBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = Number(e.target.value).toFixed(2)
        setNewEnvelopeFill(Number(e.target.value).toFixed(2));
    }

    return (
        <div className={modalBk}>
            <div className={modalCard}>
                {editEnvMsg && <Alert msg={editEnvMsg} />}
                <div className="w-full">
                    <div className="m-8 my-20 max-w-[400px] mx-auto">
                        <div className="mb-8 flex flex-col gap-2">
                            <input
                                className={text2}
                                type="text"
                                name="envTitle"
                                id="envTitle"
                                placeholder="Rent"
                                value={newEnvelopeTitle}
                                onChange={(e) => setNewEnvelopeTitle(e.target.value)}
                            />
                            <select className={text2} name="envType" id="envType" onChange={(e) => setNewEnvelopeType(e.target.value)}>
                                <option value="bill">Bill</option>
                                <option value="expense">Expense</option>
                                <option value="spending">Spending</option>
                                <option value="debt">Debt</option>
                            </select>
                            <div className="relative">
                                <span className="absolute top-3 left-4 text-slate-500">$</span>
                                <input
                                    className={`remove-arrow ${text2} pl-7`}
                                    type="number"
                                    name="envFill"
                                    id="envFill"
                                    placeholder="1250.00"
                                    onChange={(e) => setNewEnvelopeFill(e.target.value)}
                                    onBlur={handleFillBlur}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <ButtonAction onClick={handleUpdateEnvelope} disabled={disabled} text="Add Envelope" />
                            <ButtonCancel onClick={handleModalClick} text="Cancel" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
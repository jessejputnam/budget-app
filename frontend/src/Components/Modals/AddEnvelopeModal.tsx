import { useState } from "react";
import { Alert } from "../Alert";
import { modalBk, modalCard, text2 } from "../../lib/TailwindClass";
import { isValidEnvelopeTitle } from "../../lib/TextValidate";
import { envelopeAdd, envelopeGetAll } from "../../lib/Controller";
import { AddEnvelopeModalProps, Envelope } from "../../Types/types";
import { ButtonAction } from "../Buttons/ButtonAction";
import { ButtonCancel } from "../Buttons/ButtonCancel";


export function AddEnvelopeModal(props: AddEnvelopeModalProps) {
    const [newEnvelope, setNewEnvelope] = useState<string>("");
    const [newEnvelopeFill, setNewEnvelopeFill] = useState<string>("");
    const [newEnvelopeType, setNewEnvelopeType] = useState<string>("bill");
    const [addEnvMsg, setAddEnvMsg] = useState<string | null>(null);
    const [disabled, setDisabled] = useState<boolean>(false);

    const handleAddEnvelope = async () => {
        setDisabled(true);

        if (!isValidEnvelopeTitle(newEnvelope)) {
            setDisabled(false);
            setAddEnvMsg("Invalid envelope name.");
            setTimeout(() => setAddEnvMsg(null), 3000);
            return;
        }

        if (isNaN(Number(newEnvelopeFill)) || Number(newEnvelopeFill) <= 0) {
            setDisabled(false);
            setAddEnvMsg("Fill must be a valid monetary amount above $0.00.");
            setTimeout(() => setAddEnvMsg(null), 3000);
            return;
        }

        const err = await envelopeAdd(newEnvelope, Number(newEnvelopeFill), newEnvelopeType);
        if (err) {
            setDisabled(false);
            setAddEnvMsg(err)
            setTimeout(() => setAddEnvMsg(null), 3000);
        }

        props.setLoading(true);
        const [e, data] = await envelopeGetAll<Envelope>();

        if (e) { props.setEnvelopes([]); props.setError(e); }
        else { props.setEnvelopes(data?.data ?? []) }

        props.setLoading(false);
        props.setOpenModal(false);
    }


    const handleModalClick = () => { props.setOpenModal(false) };

    const handleFillBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = Number(e.target.value).toFixed(2)
        setNewEnvelopeFill(Number(e.target.value).toFixed(2));
    }

    return (
        <div className={modalBk}>
            <div className={modalCard}>
                {addEnvMsg && <Alert msg={addEnvMsg} />}
                <div className="w-full">
                    <div className="m-8 my-20 max-w-[400px] mx-auto">
                        <div className="mb-8 flex flex-col gap-2">
                            <input
                                className={text2}
                                type="text"
                                name="envTitle"
                                id="envTitle"
                                placeholder="Rent"
                                value={newEnvelope}
                                onChange={(e) => setNewEnvelope(e.target.value)}
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
                            <ButtonAction onClick={handleAddEnvelope} disabled={disabled} text="Add Envelope" />
                            <ButtonCancel onClick={handleModalClick} text="Cancel" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
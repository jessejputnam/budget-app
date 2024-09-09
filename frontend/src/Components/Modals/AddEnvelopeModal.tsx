import { useState } from "react";
import { Alert } from "../Alert";
import { modalBk, modalCard, text2 } from "../../lib/TailwindClass";
import { isValidEnvelopeTitle } from "../../lib/TextValidate";
import { envelopeAdd, envelopeGetAll } from "../../Controllers/EnvelopeController";
import { AddEnvelopeModalProps } from "../../Types/PropTypes";
import { ButtonAction } from "../Buttons/ButtonAction";
import { ButtonCancel } from "../Buttons/ButtonCancel";
import { Envelope } from "../../Classes/Envelope";
import { DbEnvelope } from "../../Types/DbTypes";

//! REMOVE WITH AUTH
const user_id = 1


export function AddEnvelopeModal(props: AddEnvelopeModalProps) {
    const [title, setTitle] = useState<string>("");
    const [fill, setFill] = useState<string>("");
    const [type, setType] = useState<string>("bill");
    const [addEnvMsg, setAddEnvMsg] = useState<string | null>(null);
    const [disabled, setDisabled] = useState<boolean>(false);

    const handleAddEnvelope = async () => {
        setDisabled(true);

        if (!isValidEnvelopeTitle(title)) {
            setDisabled(false);
            setAddEnvMsg("Invalid envelope name.");
            setTimeout(() => setAddEnvMsg(null), 3000);
            return;
        }

        if (isNaN(Number(fill)) || Number(fill) <= 0) {
            setDisabled(false);
            setAddEnvMsg("Fill must be a valid monetary amount above $0.00.");
            setTimeout(() => setAddEnvMsg(null), 3000);
            return;
        }

        const envData = {
            user_id, id: null,
            title: title,
            fill: Number(fill),
            amount: Number(fill),
            type: type
        }
        const envelope: Envelope = new Envelope(envData)
        const err = await envelopeAdd(envelope);
        if (err) {
            setDisabled(false);
            setAddEnvMsg(err)
            setTimeout(() => setAddEnvMsg(null), 3000);
            return;
        }

        props.setLoading(true);
        const [e, data] = await envelopeGetAll<DbEnvelope>();

        if (e) { props.setEnvelopes([]); props.setError(e); }
        else { props.setEnvelopes(data?.data.map((e: DbEnvelope) => new Envelope(e)) ?? []) }

        props.setLoading(false);
        props.setAddEnvelope(false);
    }


    const handleModalClick = () => { props.setAddEnvelope(false) };

    const handleFillBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = Number(e.target.value).toFixed(2)
        setFill(Number(e.target.value).toFixed(2));
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
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <select className={text2} name="envType" id="envType" onChange={(e) => setType(e.target.value)}>
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
                                    onChange={(e) => setFill(e.target.value)}
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
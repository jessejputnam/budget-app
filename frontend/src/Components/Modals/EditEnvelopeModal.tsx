import { useState } from "react";
import { Alert } from "../Alert";
import { modalBk, modalCard, text2 } from "../../lib/TailwindClass";
import { isValidEnvelopeTitle } from "../../lib/TextValidate";
import { envelopeGetAll, envelopeUpdate } from "../../Controllers/EnvelopeController";
import { EditEnvelopeModalProps } from "../../Types/PropTypes";
import { Envelope } from "../../Classes/Envelope";
import { ButtonAction } from "../Buttons/ButtonAction";
import { ButtonCancel } from "../Buttons/ButtonCancel";
import { DbEnvelope } from "../../Types/DbTypes";

//! REMOVE WITH AUTH
const user_id = 1

export function EditEnvelopeModal(props: EditEnvelopeModalProps) {
    const [title, setTitle] = useState<string>(props.editEnvelope?.title ?? "");
    const [fill, setFill] = useState<string>(props.editEnvelope?.fill?.toFixed(2) ?? "0.00");
    const [type, setType] = useState<string>(props.editEnvelope?.type ?? "");
    const [editEnvMsg, setEditEnvMsg] = useState<string | null>(null);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [amount, setAmount] = useState<number>(props.editEnvelope?.amount ?? 0);
    const id = props.editEnvelope?.id;

    const handleUpdateEnvelope = async () => {
        setDisabled(true);

        if (amount > Number(fill)) {
            setAmount(Number(fill));
        }

        if (!isValidEnvelopeTitle(title)) {
            setDisabled(false);
            setEditEnvMsg("Invalid envelope name.");
            setTimeout(() => setEditEnvMsg(null), 3000);
            return;
        }

        if (isNaN(Number(fill)) || Number(fill) <= 0) {
            setDisabled(false);
            setEditEnvMsg("Fill must be a valid monetary amount above $0.00.");
            setTimeout(() => setEditEnvMsg(null), 3000);
            return;
        }

        if (id === null || id === undefined) {
            setDisabled(false);
            setEditEnvMsg("Envelope ID cannot be null.");
            setTimeout(() => setEditEnvMsg(null), 3000);
            return;
        }


        const envData = {
            user_id,
            id: id,
            title: title,
            fill: Number(fill),
            amount: Number(fill),
            type: type
        }
        const err = await envelopeUpdate(envData);
        if (err) {
            setDisabled(false);
            setEditEnvMsg(err)
            setTimeout(() => setEditEnvMsg(null), 3000);
            return;
        }

        props.setLoading(true);
        const [e, data] = await envelopeGetAll<DbEnvelope>();

        if (e) { props.setEnvelopes([]); props.setError(e); }
        else { props.setEnvelopes(data?.data.map((e: DbEnvelope) => new Envelope(e)) ?? []) }

        props.setLoading(false);
        props.setEditEnvelope(null);
    }


    const handleCancelClick = () => { props.setEditEnvelope(null) };

    const handleFillBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = Number(e.target.value).toFixed(2)
        setFill(Number(e.target.value).toFixed(2));
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
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <select value={type} className={text2} name="envType" id="envType" onChange={(e) => setType(e.target.value)}>
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
                                    value={fill}
                                    placeholder="1250.00"
                                    onChange={(e) => setFill(e.target.value)}
                                    onBlur={handleFillBlur}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <ButtonAction onClick={handleUpdateEnvelope} disabled={disabled} text="Update Envelope" />
                            <ButtonCancel onClick={handleCancelClick} text="Cancel" />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
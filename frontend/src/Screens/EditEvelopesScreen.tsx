import { useEffect, useState } from "react";
import { Envelope } from "../Types/types";
import { EditEnvelopeItem } from "../Components/EditEnvelopeItem";
import { Alert } from "../Components/Alert";
import { envelopeGetAll, envelopeAdd } from "../lib/Controller";
import { isValidEnvelopeTitle } from "../lib/TextValidate";

import { btn1, btn2, btn3, envSection, h2, h3, modalBk, modalCard, text1, text2 } from "../lib/TailwindClass";

function filterEnvelopes(e: Envelope, type: string) {
    return e.ae_type !== type ? null : (
        <li key={e.ae_id}>
            <EditEnvelopeItem
                title={e.ae_title}
                fill={e.ae_fill}
            />
        </li>
    )
}

function EnvelopeSection(envelopes: Array<Envelope>, type: string) {
    return (
        <section className={envSection}>
            <div className="flex gap-5">
                <h3 className={h3}>{type[0].toUpperCase()}{type.substring(1)}</h3>
                <p className={`${text1} relative top-2`}>Budgeted: {envelopes && reduceTotal(envelopes, type)}</p>
            </div>
            <ul>
                {envelopes && envelopes.map((e: Envelope) => filterEnvelopes(e, type))}
            </ul>
        </section >
    )
}

function reduceTotal(envelopes: Array<Envelope>, type?: string) {
    return !type
        ? envelopes.reduce((acc, next) => acc + next.ae_fill, 0)
        : envelopes.reduce((acc, next) => acc + (next.ae_type === type ? next.ae_fill : 0), 0);
}

function EditEnvelopesScreen() {
    const [envelopes, setEnvelopes] = useState<Array<Envelope>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const [msg, setMsg] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [addEnvMsg, setAddEnvMsg] = useState<string | null>(null);
    const [newEnvelope, setNewEnvelope] = useState<string>("");
    const [newEnvelopeFill, setNewEnvelopeFill] = useState<string>("");
    const [newEnvelopeType, setNewEnvelopeType] = useState<string>("bill");

    useEffect(() => {
        const fetchData = async () => {
            const [err, data] = await envelopeGetAll<Envelope>();

            setLoading(false);
            if (err) setError(err);
            else setEnvelopes(data?.data ?? [])
        }

        fetchData();
    }, []);

    const handleAddEnvelope = async () => {
        if (!isValidEnvelopeTitle(newEnvelope)) {
            setAddEnvMsg("Invalid envelope name.");
            setTimeout(() => setAddEnvMsg(null), 3000);
            return;
        }

        if (isNaN(Number(newEnvelopeFill))) {
            setAddEnvMsg("Fill must be a valid monetary amount.");
            setTimeout(() => setAddEnvMsg(null), 3000);
            return;
        }

        const err = await envelopeAdd(newEnvelope, Number(newEnvelopeFill), newEnvelopeType);
        if (err) {
            setAddEnvMsg(err)
            setTimeout(() => setAddEnvMsg(null), 3000);
        }

        setOpenModal(false);
        setLoading(true);
        const [e, data] = await envelopeGetAll<Envelope>();
        if (e) {
            setEnvelopes([]);
            setLoading(false);
            setError(e);
        }
        else setEnvelopes(data?.data ?? [])
    }


    const handleModalClick = () => { setOpenModal(!openModal); setNewEnvelope(""); setNewEnvelopeFill(""); setNewEnvelopeType("bill") };

    const handleRefreshClick = async () => {
        setLoading(true);
        setError(null);
        const [err, data] = await envelopeGetAll<Envelope>();
        setLoading(false);
        if (err) setError(err);
        else setEnvelopes(data?.data ?? []);

    };

    const handleFillBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.target.value = Number(e.target.value).toFixed(2)
        setNewEnvelopeFill(Number(e.target.value).toFixed(2));
    }

    return (
        <>
            <h1 className={h2}>Envelopes</h1>
            {loading && <div>Loading...</div>}
            {
                error &&
                <div>
                    <p>ERROR: {error}</p>
                    <button className={btn1} onClick={handleRefreshClick}>Retry</button>
                </div>
            }

            {
                openModal &&
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
                                    <button className={btn2} onClick={handleAddEnvelope}>Add Envelope</button>
                                    <button className={btn3} onClick={handleModalClick}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }

            {
                !loading && !error &&
                <div>
                    <button className={btn1} onClick={handleModalClick}>Add Envelope</button>
                    {EnvelopeSection(envelopes, "spending")}
                    {EnvelopeSection(envelopes, "expense")}
                    {EnvelopeSection(envelopes, "bill")}
                    {EnvelopeSection(envelopes, "debt")}

                    <section>
                        <h2 className={h3}>Total Budgeted</h2>
                        <p className={text1}>{envelopes && (reduceTotal(envelopes)) || "--"}</p>
                    </section>
                </div>
            }
        </>
    );
}

export default EditEnvelopesScreen;

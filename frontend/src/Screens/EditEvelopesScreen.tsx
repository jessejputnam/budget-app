import { useEffect, useState } from "react";
import { Envelope } from "../Types/types";
import { EditEnvelopeItem } from "../Components/EditEnvelopeItem";
import { Alert } from "../Components/Alert";
import { envelopeGetAll } from "../lib/Controller";
import { isValidEnvelopeTitle } from "../lib/TextValidate";

import { btn1, btn2, btn3, h2, h3, modalBk, modalCard, text1, text2 } from "../lib/TailwindClass";

function filterEnvelopes(e: Envelope, type: string) {
    return e.type !== type ? null : (
        <li key={e.id}>
            <EditEnvelopeItem
                title={e.title}
                fill={e.fill}
            />
        </li>
    )
}

function reduceTotal(envelopes: Array<Envelope>, type?: string) {
    return !type
        ? envelopes.reduce((acc, next) => acc + next.fill, 0)
        : envelopes.reduce((acc, next) => acc + (next.type === type ? next.fill : 0), 0);
}

function EditEnvelopesScreen() {
    const [envelopes, setEnvelopes] = useState<Array<Envelope>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const [msg, setMsg] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [addEnvMsg, setAddEnvMsg] = useState<string | null>(null);
    const [newEnvelope, setNewEnvelope] = useState<string>("");
    // const [newEnvelopeFill, setNewEnvelopeFill] = useState<string>("");

    useEffect(() => {
        const fetchData = async () => {
            const [err, data] = await envelopeGetAll<Envelope>();

            setLoading(false);
            if (err) setError(err);
            else setEnvelopes(data?.data ?? [])
        }

        fetchData();
    }, []);

    function EnvelopeSection(envelopes: Array<Envelope>, type: string) {
        return (
            <section className="container max-w-screen-xl mx-auto">
                <h3 className={h3}>{type[0].toUpperCase()}{type.substring(1)}</h3>
                <p className={text1}>Budgeted: {envelopes && reduceTotal(envelopes, type)}</p>
                <ul>
                    {envelopes && envelopes.map((e: Envelope) => filterEnvelopes(e, type))}
                </ul>
            </section >
        )
    }

    const handleAddEnvelope = async () => {
        if (!isValidEnvelopeTitle(newEnvelope)) {
            setAddEnvMsg("Invalid envelope name.");
            setTimeout(() => setAddEnvMsg(null), 3000);
            return;
        }


        // await envelopeAdd(newEnvelope,);
        setOpenModal(false);
        setNewEnvelope("");


    }


    const handleModalClick = () => { setOpenModal(!openModal); setNewEnvelope("") };

    return (
        <>
            <h1 className={h2}>Envelopes</h1>
            {loading && <div>Loading...</div>}
            {error && <div>ERROR: {error}</div>}
            {/* {msg && <Alert msg={msg} />} */}

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
                                        onChange={e => setNewEnvelope(e.target.value)}
                                    />
                                    <select className={text2} name="envType" id="envType">
                                        <option value="bill">Bill</option>
                                        <option value="expense">Expense</option>
                                        <option value="spending">Spending</option>
                                        <option value="debt">Debt</option>
                                    </select>
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
                !loading &&
                <div>
                    <button className={btn1} onClick={handleModalClick}>Add Envelope</button>
                    {EnvelopeSection(envelopes, "spending")}
                    {EnvelopeSection(envelopes, "expense")}
                    {EnvelopeSection(envelopes, "bill")}
                    {EnvelopeSection(envelopes, "debt")}

                    <section>
                        <h2 className={h3}>Total Budgeted</h2>
                        <p className={text1}>{envelopes && reduceTotal(envelopes)}</p>
                    </section>
                </div>
            }
        </>
    );
}

export default EditEnvelopesScreen;

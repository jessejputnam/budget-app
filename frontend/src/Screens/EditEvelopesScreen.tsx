import { useEffect, useState } from "react";
import { Envelope } from "../Types/types";
import { EditEnvelopeItem } from "../Components/EditEnvelopeItem";
import { fetchEnvelopes } from "../lib/DataFetch";

const cssBtn = "bg-white hover:bg-gray-100 text-gray-800 py-1 px-2 border border-gray-400 rounded shadow";

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
    const [openModal, setOpenModal] = useState<boolean>(false);

    function EnvelopeSection(envelopes: Array<Envelope>, type: string) {
        return (
            <section className="container max-w-screen-xl mx-auto">
                <h3 className="text-3xl font-bold dark:text-white">{type[0].toUpperCase()}{type.substring(1)}</h3>
                <p className="text-sm font-normal text-gray-500 lg:text-xl dark:text-gray-400">Budgeted: {envelopes && reduceTotal(envelopes, type)}</p>
                <ul>
                    {envelopes && envelopes.map((e: Envelope) => filterEnvelopes(e, type))}
                </ul>
            </section >
        )
    }

    useEffect(() => {
        fetchEnvelopes(setEnvelopes, setError, setLoading);
    }, []);

    const handleModalClick = () => setOpenModal(!openModal);

    return (
        <>
            <h1>Envelopes</h1>
            {loading && <div>Loading...</div>}
            {error && <div>ERROR: {error}</div>}

            {
                openModal &&
                <div className="fixed left-0 top-0 flex h-full w-full items-center justify-center bg-black bg-opacity-50 py-10">
                    <div className="max-h-full w-full max-w-xl overflow-y-auto sm:rounded-2xl bg-white">
                        <div className="w-full">
                            <div className="m-8 my-20 max-w-[400px] mx-auto">
                                <div className="mb-8 flex flex-col gap-2">
                                    <input className="p-3 bg-white border rounded-sm w-full font-semibold" type="text" name="envTitle" id="envTitle" placeholder="Rent" />
                                    <select className="p-3 bg-white border rounded-sm w-full font-semibold" name="envType" id="envType">
                                        <option value="bill">Bill</option>
                                        <option value="expense">Expense</option>
                                        <option value="spending">Spending</option>
                                        <option value="debt">Debt</option>
                                    </select>
                                </div>
                                <div className="space-y-4">
                                    <button className="p-3 bg-white border rounded-full w-full font-semibold" onClick={handleModalClick}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            }

            {
                !loading &&
                <div>
                    <button className={cssBtn} onClick={handleModalClick}>Add Envelope</button>
                    {EnvelopeSection(envelopes, "spending")}
                    {EnvelopeSection(envelopes, "expense")}
                    {EnvelopeSection(envelopes, "bill")}
                    {EnvelopeSection(envelopes, "debt")}

                    <section>
                        <h2 className="text-4xl font-bold dark:text-white">Total Budgeted</h2>
                        <p className="text-lg font-normal text-gray-500 lg:text-xl dark:text-gray-400">{envelopes && reduceTotal(envelopes)}</p>
                    </section>
                </div>
            }
        </>
    );
}

export default EditEnvelopesScreen;

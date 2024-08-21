import { useEffect, useState } from "react";
import "../App.css";
import { Envelope } from "../Types/types";
import { EditEnvelopeItem } from "../Components/EditEnvelopeItem";

const url = import.meta.env.VITE_URL;

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

function reduceTotal(envelopes: Array<Envelope>, type: string | null = null) {
    return !type
        ? envelopes.reduce((acc, next) => acc + next.fill, 0)
        : envelopes.reduce((acc, next) => acc + (next.type === type ? next.fill : 0), 0);
}

function EditEnvelopesScreen() {
    const [envelopes, setEnvelopes] = useState<[Envelope] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res: Response = await fetch(`${url}/envelopes`);
                if (!res.ok) throw new Error(`HTTP error: Status ${res.status}`);

                const envelopeData = await res.json();

                setEnvelopes(envelopeData.data);
                setError(null);

            } catch (err) {
                if (err instanceof Error) setError(err.message);
                else setError(err as string);
                console.log(err)
                setEnvelopes(null);

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            <h1>Envelopes</h1>
            {loading && <div>Loading...</div>}
            {error && <div>ERROR: {error}</div>}

            <section className={"envelopes"}>
                <h2>Spending</h2>
                <p>Budgeted: {envelopes && reduceTotal(envelopes, "spending")}</p>
                <ul>
                    {envelopes && envelopes.map((e: Envelope) => filterEnvelopes(e, "spending"))}
                </ul>
            </section >

            <section className={"envelopes"}>
                <h2>Expenses</h2>
                <p>Budgeted: {envelopes && reduceTotal(envelopes, "expense")}</p>
                <ul>
                    {envelopes && envelopes.map((e: Envelope) => filterEnvelopes(e, "expense"))}
                </ul>
            </section>

            <section className={"envelopes"}>
                <h2>Bills</h2>
                <p>Budgeted: {envelopes && reduceTotal(envelopes, "bill")}</p>
                <ul>
                    {envelopes && envelopes.map((e: Envelope) => filterEnvelopes(e, "bill"))}
                </ul>
            </section>

            <section className={"envelopes"}>
                <h2>Debts</h2>
                <p>Budgeted: {envelopes && reduceTotal(envelopes, "debt")}</p>
                <ul>
                    {envelopes && envelopes.map((e: Envelope) => filterEnvelopes(e, "debt"))}
                </ul>
            </section>

            <section>
                <h2>Total Budgeted</h2>
                <p>{envelopes && reduceTotal(envelopes)}</p>
            </section>
        </>
    );
}

export default EditEnvelopesScreen;

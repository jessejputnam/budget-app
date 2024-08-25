import { useEffect, useState } from "react";
import { Envelope } from "../Types/types";
import { EnvelopeItem } from "../Components/EnvelopeItem";
import { fetchEnvelopes } from "../lib/DataFetch";


function filterEnvelopes(e: Envelope, type: string) {
    return e.type !== type ? null : (
        <li key={e.id}>
            <EnvelopeItem
                title={e.title}
                amount={e.amount}
                fill={e.fill}
            />
        </li>
    )
}

function reduceTotal(envelopes: Array<Envelope>, type: string) {
    return envelopes.reduce((acc, next) => acc + (next.type === type ? next.amount : 0), 0);
}

function EnvelopeSection(envelopes: Array<Envelope>, type: string) {
    return (
        <section>
            <h2>{type[0].toUpperCase()}{type.substring(1)}</h2>
            <p>Left: {envelopes && reduceTotal(envelopes, type)}</p>
            <ul>
                {envelopes && envelopes.map((e: Envelope) => filterEnvelopes(e, type))}
            </ul>
        </section >
    )
}


function HomeScreen() {
    const [envelopes, setEnvelopes] = useState<Array<Envelope>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEnvelopes(setEnvelopes, setError, setLoading);
    }, []);

    return (
        <>
            <h1>Envelopes</h1>
            {loading && <div>Loading...</div>}
            {error && <div>ERROR: {error}</div>}

            {
                !loading &&
                <div>
                    {EnvelopeSection(envelopes, "spending")}
                    {EnvelopeSection(envelopes, "expense")}
                    {EnvelopeSection(envelopes, "bill")}
                    {EnvelopeSection(envelopes, "debt")}
                </div>
            }
        </>
    );
}

export default HomeScreen;

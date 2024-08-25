import { useEffect, useState } from "react";
import "../App.css";
import { Envelope } from "../Types/types";
import { EnvelopeItem } from "../Components/EnvelopeItem";
import { fetchEnvelopes } from "../lib/fetch";


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


function HomeScreen() {
    const [envelopes, setEnvelopes] = useState<[Envelope] | null>(null);
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

            {!loading &&
                <div>
                    <section className={"envelopes"}>
                        <h2>Spending</h2>
                        <p>Left: {envelopes && reduceTotal(envelopes, "spending")}</p>
                        <ul>
                            {envelopes && envelopes.map((e: Envelope) => filterEnvelopes(e, "spending"))}
                        </ul>
                    </section >

                    <section className={"envelopes"}>
                        <h2>Expenses</h2>
                        <p>Left: {envelopes && reduceTotal(envelopes, "expense")}</p>
                        <ul>
                            {envelopes && envelopes.map((e: Envelope) => filterEnvelopes(e, "expense"))}
                        </ul>
                    </section>

                    <section className={"envelopes"}>
                        <h2>Bills</h2>
                        <p>Left: {envelopes && reduceTotal(envelopes, "bill")}</p>
                        <ul>
                            {envelopes && envelopes.map((e: Envelope) => filterEnvelopes(e, "bill"))}
                        </ul>
                    </section>

                    <section className={"envelopes"}>
                        <h2>Debts</h2>
                        <p>Left: {envelopes && reduceTotal(envelopes, "debt")}</p>
                        <ul>
                            {envelopes && envelopes.map((e: Envelope) => filterEnvelopes(e, "debt"))}
                        </ul>
                    </section>
                </div>
            }
        </>
    );
}

export default HomeScreen;

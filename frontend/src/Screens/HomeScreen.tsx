import { useEffect, useState } from "react";
import { Envelope } from "../Types/types";
import { EnvelopeItem } from "../Components/EnvelopeItem";
import { btn1, envSection, h2, h3, text1 } from "../lib/TailwindClass";
import { envelopeGetAll } from "../lib/Controller";


function filterEnvelopes(e: Envelope, type: string) {
    return e.ae_type !== type ? null : (
        <li key={e.ae_id}>
            <EnvelopeItem
                title={e.ae_title}
                amount={e.ae_amount}
                fill={e.ae_fill}
            />
        </li>
    )
}

function reduceTotal(envelopes: Array<Envelope>, type: string) {
    return envelopes.reduce((acc, next) => acc + (next.ae_type === type ? next.ae_amount : 0), 0);
}

function EnvelopeSection(envelopes: Array<Envelope>, type: string) {
    return (
        <section className={envSection}>
            <div className="flex gap-5">
                <h3 className={h3}>{type[0].toUpperCase()}{type.substring(1)}{type === "spending" ? "" : "s"}</h3>
                <p className={`${text1} relative top-2`}>Left: {envelopes && reduceTotal(envelopes, type)}</p>
            </div>
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
        const fetchData = async () => {
            const [err, data] = await envelopeGetAll<Envelope>();

            setLoading(false);
            if (err) setError(err);
            else setEnvelopes(data?.data ?? [])
        }

        fetchData();
    }, []);

    const handleRefreshClick = async () => {
        setLoading(true);
        setError(null);

        const [err, data] = await envelopeGetAll<Envelope>();
        setLoading(false);

        if (err) setError(err);
        else setEnvelopes(data?.data ?? []);
    };

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
                !loading && !error &&
                <div>
                    {EnvelopeSection(envelopes, "spending")}
                    {EnvelopeSection(envelopes, "expense")}
                    {EnvelopeSection(envelopes, "bill")}
                    {EnvelopeSection(envelopes, "debt")}
                </div >
            }
        </>
    );
}

export default HomeScreen;

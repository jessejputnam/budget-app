import { useEffect, useState } from "react";
import { Envelope } from "../Types/types";
import { h2 } from "../lib/TailwindClass";
import { envelopeGetAll } from "../lib/Controller";
import { EnvelopeSection } from "../Components/EnvelopeSection";
import { ButtonRefreshEnvelopes } from "../Components/Buttons/ButtonRefreshEnvelopes";
import { LoadingSpinner } from "../Components/LoadingSpinner";


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

    const btnProps = { setEnvelopes, setLoading, setError }

    return (
        <div>
            <h1 className={h2}>Envelopes</h1>
            {loading && <LoadingSpinner />}
            {error &&
                <div>
                    <p>ERROR: {error}</p>
                    <ButtonRefreshEnvelopes {...btnProps} />
                </div>}

            {!loading && !error &&
                <div>
                    {EnvelopeSection({ envelopes, type: "spending" })}
                    {EnvelopeSection({ envelopes, type: "expense" })}
                    {EnvelopeSection({ envelopes, type: "bill" })}
                    {EnvelopeSection({ envelopes, type: "debt" })}
                </div >}
        </div>
    );
}

export default HomeScreen;

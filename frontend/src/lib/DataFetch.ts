import { Envelope } from "../Types/types";

const url = import.meta.env.VITE_URL;


export async function fetchEnvelopes(
    setEnvelopes: React.Dispatch<React.SetStateAction<Array<Envelope>>>,
    setError: React.Dispatch<React.SetStateAction<string | null>>,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>) {
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
        setEnvelopes([] as Array<Envelope>);

    } finally {
        setLoading(false);
    }
}
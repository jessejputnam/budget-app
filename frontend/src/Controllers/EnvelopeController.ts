import { ApiRes } from "../Types/Types.ts";
import { Envelope } from "../Classes/Envelope.ts";

const url = import.meta.env.VITE_URL;


// ############# ENVELOPES ##############

// 
export async function envelopeGetAll<T>(): Promise<ApiRes<T>> {
    try {
        // API call
        const res: Response = await fetch(`${url}/envelopes`);
        if (!res.ok) throw new Error(`HTTP error: Status ${res.status}`);

        // Data
        const envelopeData = await res.json();
        return [null, envelopeData];
    } catch (err) {
        console.log(err)
        return [err instanceof Error ? err.message : err as string, null]
    }
}

export async function envelopeAdd(env: Envelope): Promise<string | null> {
    try {
        // 
        const res: Response = await fetch(`${url}/envelopes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({ user_id: 1, title: encodeURIComponent(env.title), fill: env.amount, type: env.type })
        });

        if (!res.ok) {
            console.log(`HTTP error: Status ${res.status}`);
            return `HTTP error: Status ${res.status}`;
        }
        const data = await res.json();
        if (data.status == "ERROR")
            return data.message
        return null
    } catch (err) {
        console.log(err);
        return err instanceof Error ? err.message : err as string
    }
}

export async function envelopeDeleteOne(envelopeId: number): Promise<string | null> {
    try {
        const res: Response = await fetch(`${url}/envelopes/${envelopeId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        });

        if (!res.ok) {
            console.log(`HTTP error: Status ${res.status}`);
            return `HTTP error: Status ${res.status}`;
        }

        const data = await res.json();
        if (data.status == "ERROR")
            return data.message
        return null
    } catch (err) {
        console.log(err);
        return err instanceof Error ? err.message : err as string
    }
}

export async function envelopeUpdate(envelope: Envelope): Promise<string | null> {
    try {
        const id = envelope.id;
        if (id === null) return "Envelope ID missing."

        const res: Response = await fetch(`${url}/envelopes/${id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify(envelope)
        });

        if (!res.ok) {
            console.log(`HTTP error: Status ${res.status}`);
            return `HTTP error: Status ${res.status}`;
        }

        const data = await res.json();
        if (data.status == "ERROR")
            return data.message
        return null
    } catch (err) {
        console.log(err);
        return err instanceof Error ? err.message : err as string
    }
}
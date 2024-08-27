import { ApiRes } from "../Types/types";

const url = import.meta.env.VITE_URL;


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

export async function envelopeAdd(envName: string, envFill: number, envType: string) {
    try {
        // 
        const res: Response = await fetch(`${url}/envelopes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            },
            body: JSON.stringify({ user_id: 1, title: encodeURIComponent(envName), fill: envFill, type: envType })
        });

        if (!res.ok) {
            console.log(`HTTP error: Status ${res.status}`);
            return [new Error(`HTTP error: Status ${res.status}`), null];
        }
        const data = await res.json();
        console.log(data)
        return [null, 200]
    } catch (err) {
        console.log(err);
        return [err instanceof Error ? err.message : err as string, null]
    }
}
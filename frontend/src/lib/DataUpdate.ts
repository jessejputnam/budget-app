const url = import.meta.env.VITE_URL;


export async function addEnvelope(envName: string, envFill: number, envType: string) {
    try {
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
        const d = await res.json();
        console.log(d.data);
    } catch (err) {
        if (err instanceof Error) {
            console.log(err);
            return [err, null]
        }
    }
}
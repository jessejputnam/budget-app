import { useEffect, useState } from "react";
import "./App.css";
import { Envelope } from "./types/types";
import { EnvelopeItem } from "./Components/EnvelopeItem";

// const domain = import.meta.env.URL;

function App() {
  const [envelopes, setEnvelopes] = useState<[Envelope] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res: Response = await fetch(`http://127.0.0.1:8000/envelopes`);
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
      <section>
        <h2>Spending</h2>
        <ul>
          {envelopes &&
            envelopes.map((e: Envelope) => (
              <li key={e.id}>
                <EnvelopeItem
                  title={e.title}
                  amount={e.amount}
                  fill={e.fill}
                />
              </li>
            ))}
        </ul>
      </section >
      <section>
        <h2>Expenses</h2>
      </section>
      <section>
        <h2>Bills</h2>
      </section>
    </>
  );
}

export default App;

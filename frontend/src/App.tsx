import { useEffect, useState } from "react";
import "./App.css";
import { Envelope } from "./types/types";
import { EnvelopeItem } from "./Components/EnvelopeItem";

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
    </>
  );
}

export default App;

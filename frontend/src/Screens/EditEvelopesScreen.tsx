import { useEffect, useState } from "react";
import { EditEnvelopeSectionArgs, Envelope } from "../Types/types";
import { EditEnvelopeItem } from "../Components/EditEnvelopeItem";
import { AddEnvelopeModal } from "../Components/Modals/AddEnvelopeModal";
import { DelEnvelopeModal } from "../Components/Modals/DelEnvelopeModal";
import { envelopeGetAll } from "../lib/Controller";

import { btn1, envSection, h2, h3, text1 } from "../lib/TailwindClass";

function filterEnvelopes(
    e: Envelope,
    type: string,
    setDelEnvelope: React.Dispatch<React.SetStateAction<Envelope | null>>
) {
    return e.ae_type !== type ? null : (
        <li key={e.ae_id}>
            <EditEnvelopeItem
                envelope={e}
                setDelEnvelope={setDelEnvelope}
            />
        </li>
    )
}

function EnvelopeSection({ envelopes, type, setDelEnvelope }: EditEnvelopeSectionArgs) {
    return (
        <section className={envSection}>
            <div className="flex gap-5">
                <h3 className={h3}>{type[0].toUpperCase()}{type.substring(1)}</h3>
                <p className={`${text1} relative top-2`}>Budgeted: {envelopes && reduceTotal(envelopes, type)}</p>
            </div>
            <ul>
                {envelopes && envelopes.map((e: Envelope) => filterEnvelopes(e, type, setDelEnvelope))}
            </ul>
        </section >
    )
}

function reduceTotal(envelopes: Array<Envelope>, type?: string): string {
    return !type
        ? envelopes.reduce((acc, next) => acc + next.ae_fill, 0).toLocaleString("en-US", { style: "currency", currency: "USD" })
        : envelopes.reduce((acc, next) => acc + (next.ae_type === type ? next.ae_fill : 0), 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function EditEnvelopesScreen() {
    const [envelopes, setEnvelopes] = useState<Array<Envelope>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [delEnvelope, setDelEnvelope] = useState<Envelope | null>(null);

    const addEnvModProps = {
        setOpenModal,
        setLoading,
        setError,
        setEnvelopes
    }

    const delEnvModProps = {
        delEnvelope,
        setDelEnvelope,
        setLoading,
        setError,
        setEnvelopes
    }

    useEffect(() => {
        const fetchData = async () => {
            const [err, data] = await envelopeGetAll<Envelope>();

            setLoading(false);
            if (err) setError(err);
            else setEnvelopes(data?.data ?? [])
        }

        fetchData();
    }, []);

    const handleModalClick = () => { setOpenModal(!openModal) };

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

            {openModal && <AddEnvelopeModal {...addEnvModProps} />}
            {delEnvelope && <DelEnvelopeModal {...delEnvModProps} />}


            {
                !loading && !error &&
                <div>
                    <button className={btn1} onClick={handleModalClick}>Add Envelope</button>
                    {EnvelopeSection({ envelopes, type: "spending", setDelEnvelope })}
                    {EnvelopeSection({ envelopes, type: "expense", setDelEnvelope })}
                    {EnvelopeSection({ envelopes, type: "bill", setDelEnvelope })}
                    {EnvelopeSection({ envelopes, type: "debt", setDelEnvelope })}

                    <section>
                        <h2 className={h3}>Total Budgeted</h2>
                        <p className={text1}>{envelopes && `${(reduceTotal(envelopes)) || "--"}`}</p>
                    </section>
                </div>
            }
        </>
    );
}

export default EditEnvelopesScreen;

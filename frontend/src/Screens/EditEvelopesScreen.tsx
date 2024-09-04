import { useEffect, useState } from "react";
import { Envelope } from "../Types/types";
import { AddEnvelopeModal } from "../Components/Modals/AddEnvelopeModal";
import { DelEnvelopeModal } from "../Components/Modals/DelEnvelopeModal";
import { envelopeGetAll } from "../lib/Controller";

import { btn1, h2, h3, text1 } from "../lib/TailwindClass";
import { EnvelopeSection } from "../Components/EnvelopeSection";
import { ButtonRefreshEnvelopes } from "../Components/Buttons/ButtonRefreshEnvelopes";
import { LoadingSpinner } from "../Components/LoadingSpinner";

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

    const btnProps = { setEnvelopes, setLoading, setError }

    return (
        <>
            <h1 className={h2}>Edit Envelopes</h1>
            {loading && <LoadingSpinner />}

            {error &&
                <div>
                    <p>ERROR: {error}</p>
                    <ButtonRefreshEnvelopes {...btnProps} />
                </div>}

            {openModal && <AddEnvelopeModal {...addEnvModProps} />}
            {delEnvelope && <DelEnvelopeModal {...delEnvModProps} />}


            {
                !loading && !error &&
                <div>
                    <button className={btn1} onClick={handleModalClick}>Add Envelope</button>
                    {EnvelopeSection({ envelopes, type: "spending", isEdit: true, setDelEnvelope })}
                    {EnvelopeSection({ envelopes, type: "expense", isEdit: true, setDelEnvelope })}
                    {EnvelopeSection({ envelopes, type: "bill", isEdit: true, setDelEnvelope })}
                    {EnvelopeSection({ envelopes, type: "debt", isEdit: true, setDelEnvelope })}

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

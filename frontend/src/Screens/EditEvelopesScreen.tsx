import { useEffect, useState } from "react";
import { Envelope } from "../Classes/Envelope";
import { AddEnvelopeModal } from "../Components/Modals/AddEnvelopeModal";
import { DelEnvelopeModal } from "../Components/Modals/DelEnvelopeModal";
import { envelopeGetAll } from "../Controllers/EnvelopeController";

import { btn1, envSection, h2, h3, text1 } from "../lib/TailwindClass";
import { EnvelopeSection } from "../Components/EnvelopeSection";
import { ButtonRefreshEnvelopes } from "../Components/Buttons/ButtonRefreshEnvelopes";
import { LoadingSpinner } from "../Components/LoadingSpinner";
import { DbEnvelope } from "../Types/DbTypes";
import { EditEnvelopeModal } from "../Components/Modals/EditEnvelopeModal";

function reduceTotal(envelopes: Array<Envelope>, type?: string): string {
    return !type
        ? envelopes.reduce((acc, next) => acc + (next.fill ?? 0), 0).toLocaleString("en-US", { style: "currency", currency: "USD" })
        : envelopes.reduce((acc, next) => acc + (next.type === type ? (next.fill ?? 0) : 0), 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function EditEnvelopesScreen() {
    const [envelopes, setEnvelopes] = useState<Array<Envelope>>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [addEnvelope, setAddEnvelope] = useState<boolean>(false);
    const [delEnvelope, setDelEnvelope] = useState<Envelope | null>(null);
    const [editEnvelope, setEditEnvelope] = useState<Envelope | null>(null);

    const commonStates = {
        setLoading,
        setError,
        setEnvelopes
    }

    const addEnvModProps = {
        setAddEnvelope,
        ...commonStates
    }

    const delEnvModProps = {
        delEnvelope,
        setDelEnvelope,
        ...commonStates
    }

    const editEnvModProps = {
        editEnvelope,
        setEditEnvelope,
        ...commonStates
    }

    function buildSectionProps(type: string) {
        return { envelopes, type, isEdit: true, setDelEnvelope, setEditEnvelope }
    }

    useEffect(() => {
        const fetchData = async () => {
            const [err, data] = await envelopeGetAll<DbEnvelope>();

            setLoading(false);
            if (err) setError(err);
            else setEnvelopes(data?.data.map((e: DbEnvelope) => new Envelope(e)) ?? [])
        }

        fetchData();
    }, []);

    const handleModalClick = () => { setAddEnvelope(!addEnvelope) };

    const btnProps = { setEnvelopes, setLoading, setError }

    return (
        <div className={envSection}>
            <h1 className={h2}>Edit Envelopes</h1>
            {loading && <LoadingSpinner />}

            {error &&
                <div>
                    <p>ERROR: {error}</p>
                    <ButtonRefreshEnvelopes {...btnProps} />
                </div>}

            {addEnvelope && <AddEnvelopeModal {...addEnvModProps} />}
            {delEnvelope && <DelEnvelopeModal {...delEnvModProps} />}
            {editEnvelope && <EditEnvelopeModal {...editEnvModProps} />}


            {
                !loading && !error &&
                <div>
                    <button className={btn1} onClick={handleModalClick}>Add Envelope</button>
                    {EnvelopeSection(buildSectionProps("spending"))}
                    {EnvelopeSection(buildSectionProps("expense"))}
                    {EnvelopeSection(buildSectionProps("bill"))}
                    {EnvelopeSection(buildSectionProps("edit"))}

                    <section>
                        <h2 className={h3}>Total Budgeted</h2>
                        <p className={text1}>{envelopes && `${(reduceTotal(envelopes)) || "--"}`}</p>
                    </section>
                </div>
            }
        </div>
    );
}

export default EditEnvelopesScreen;

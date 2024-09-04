import { envSection, h3, text1 } from "../lib/TailwindClass";
import { Envelope, EnvelopeSectionProps } from "../Types/types";
import { EditEnvelopeItem } from "./EditEnvelopeItem";
import { EnvelopeItem } from "./EnvelopeItem";

function reduceTotal(envelopes: Array<Envelope>, type: string): string {
    return envelopes
        .reduce((acc, next) => acc + (next.ae_type === type ? next.ae_amount : 0), 0)
        .toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function reduceEditTotal(envelopes: Array<Envelope>, type?: string): string {
    return !type
        ? envelopes
            .reduce((acc, next) => acc + next.ae_fill, 0)
            .toLocaleString("en-US", { style: "currency", currency: "USD" })
        : envelopes
            .reduce((acc, next) => acc + (next.ae_type === type ? next.ae_fill : 0), 0)
            .toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function filterEditEnvelopes(e: Envelope, type: string, setDelEnvelope?: React.Dispatch<React.SetStateAction<Envelope | null>>) {
    if (setDelEnvelope === undefined) return null;
    return e.ae_type !== type
        ? null
        : (<li key={e.ae_id}>
            <EditEnvelopeItem envelope={e} setDelEnvelope={setDelEnvelope} />
        </li>)
}

function filterEnvelopes(e: Envelope, type: string) {
    return e.ae_type !== type
        ? null
        : (
            <li key={e.ae_id}>
                <EnvelopeItem envelope={e} />
            </li>
        )
}

export function EnvelopeSection(props: EnvelopeSectionProps) {
    return (
        <section className={envSection}>
            <div className="flex gap-5">
                <h3 className={h3}>
                    {props.type[0].toUpperCase()}{props.type.substring(1)}{props.type === "spending" ? "" : "s"}
                </h3>
                <div className="flex flex-col justify-end py-5">
                    <p className={`${text1}`}>
                        {props.setDelEnvelope === undefined
                            ? `Left: ${props.envelopes && reduceTotal(props.envelopes, props.type)}`
                            : `Budgeted: ${props.envelopes && reduceEditTotal(props.envelopes, props.type)}`}
                    </p>
                </div>
            </div>
            <ul className="flex flex-col gap-1">
                {props.envelopes &&
                    (props.isEdit
                        ? props.envelopes.map((e: Envelope) => filterEditEnvelopes(e, props.type, props.setDelEnvelope))
                        : props.envelopes.map((e: Envelope) => filterEnvelopes(e, props.type)))
                }
            </ul>
        </section >
    )
}
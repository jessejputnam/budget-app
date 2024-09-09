import { envSection, h3, text1 } from "../lib/TailwindClass";
import { EnvelopeSectionProps } from "../Types/PropTypes";
import { EditEnvelopeItem } from "./EditEnvelopeItem";
import { EnvelopeItem } from "./EnvelopeItem";
import { Envelope } from "../Classes/Envelope";

function reduceTotal(envelopes: Array<Envelope>, type: string): string {
    return envelopes
        .reduce((acc, next) => acc + (next.type === type ? next.amount : 0), 0)
        .toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function reduceEditTotal(envelopes: Array<Envelope>, type?: string): string {
    return !type
        ? envelopes
            .reduce((acc, next) => acc + next.fill, 0)
            .toLocaleString("en-US", { style: "currency", currency: "USD" })
        : envelopes
            .reduce((acc, next) => acc + (next.type === type ? next.fill : 0), 0)
            .toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function filterEditEnvelopes(
    e: Envelope,
    type: string,
    setDelEnvelope?: React.Dispatch<React.SetStateAction<Envelope | null>>,
    setEditEnvelope?: React.Dispatch<React.SetStateAction<Envelope | null>>
) {
    if (setDelEnvelope === undefined || setEditEnvelope === undefined) return null;
    return e.type !== type
        ? null
        : (<li key={e.id}>
            <EditEnvelopeItem envelope={e} setDelEnvelope={setDelEnvelope} setEditEnvelope={setEditEnvelope} />
        </li>)
}

function filterEnvelopes(e: Envelope, type: string) {
    return e.type !== type
        ? null
        : (
            <li key={e.id}>
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
                        ? props.envelopes.map(
                            (e: Envelope) => filterEditEnvelopes(
                                e, props.type, props.setDelEnvelope, props.setEditEnvelope
                            )
                        )
                        : props.envelopes.map((e: Envelope) => filterEnvelopes(e, props.type)))
                }
            </ul>
        </section >
    )
}
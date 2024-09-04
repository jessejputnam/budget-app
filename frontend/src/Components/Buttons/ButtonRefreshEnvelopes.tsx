import { envelopeGetAll } from "../../lib/Controller";
import { btn1 } from "../../lib/TailwindClass";
import { ButtonRefreshEnvelopesProps, Envelope } from "../../Types/types";

export function ButtonRefreshEnvelopes(props: ButtonRefreshEnvelopesProps) {
    const handleRefreshClick = async () => {
        props.setLoading(true);
        props.setError(null);

        const [err, data] = await envelopeGetAll<Envelope>();
        props.setLoading(false);

        if (err) props.setError(err);
        else props.setEnvelopes(data?.data ?? []);
    };

    return (<button className={btn1} onClick={handleRefreshClick}>Retry</button>)
}
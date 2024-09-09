import { DbEnvelope } from "../Types/DbTypes";

export class Envelope {
    id: number | null;
    user_id: number;
    title: string;
    amount: number;
    fill: number;
    type: string;

    constructor(data: Envelope | DbEnvelope) {
        //! REMOVE WITH AUTH
        data instanceof Envelope ? data.user_id = 1 : data.ae_ua_id;

        if (data instanceof Envelope) {
            this.id = data.id ?? null;
            this.user_id = data.user_id;
            this.title = data.title;
            this.amount = data.amount;
            this.fill = data.fill;
            this.type = data.type;
        } else {
            this.id = data.ae_id ?? null;
            this.user_id = data.ae_ua_id;
            this.title = data.ae_title;
            this.amount = data.ae_amount;
            this.fill = data.ae_fill;
            this.type = data.ae_type;
        }

    }
}
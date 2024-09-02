import { btn3 } from "../../lib/TailwindClass";
import { ButtonProp } from "../../Types/types";

export function ButtonCancel(props: ButtonProp) {

    return (
        <>
            <button
                className={btn3}
                onClick={props?.onClick}
                disabled={props?.disabled}
            >
                {props.text}
            </button>
        </>
    )
}
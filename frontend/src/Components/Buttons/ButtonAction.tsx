import { btn2 } from "../../lib/TailwindClass";
import { ButtonProps } from "../../Types/types";

export function ButtonAction(props: ButtonProps) {
    return (
        <>
            <button
                className={btn2}
                onClick={props.onClick}
                disabled={props.disabled}
            >
                {props.text}
            </button>
        </>
    )
}
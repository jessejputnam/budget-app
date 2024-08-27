import { AlertProp } from "../Types/types"
export function Alert({ msg }: AlertProp) {
    return (
        <div className="absolute top-0 w-full">
            <div className="bg-red-500 text-white font-bold rounded-t px-4 py-2">
                Alert
            </div>
            <div className="border border-t-0 border-red-400 rounded-b bg-red-100 px-4 py-3 text-red-700">
                <p>{msg}</p>
            </div>
        </div>
    )
}
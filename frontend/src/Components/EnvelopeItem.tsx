import { EnvelopeProp } from "../Types/types"

export function EnvelopeItem({ title, amount, fill }: EnvelopeProp) {
  return (
    <>
      <h5>{title}</h5>
      <p>Amount: {amount}</p>
      <p>Total: {fill}</p>
    </>
  )
}
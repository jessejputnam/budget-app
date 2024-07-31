// import { useState } from 'react'
import { EnvelopeProp } from "../types/types"

export function EnvelopeItem({ title, amount, fill }: EnvelopeProp) {
  // const [count, setCount] = useState(0)

  return (
    <>
      <h5>{title}</h5>
      <p>Amount: {amount}</p>
      <p>Total: {fill}</p>
    </>
  )
}
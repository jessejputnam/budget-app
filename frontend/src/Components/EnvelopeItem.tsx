import { EnvelopeProp } from "../Types/PropTypes"

export function EnvelopeItem(props: EnvelopeProp) {
  return (
    <div className="w-5/6">
      <div className="border-t border-r border-b border-l border-gray-400 bg-white rounded-md p-4 flex justify-between">
        <div className="w-1/3">
          <h5>{decodeURIComponent(props.envelope.title)}</h5>
        </div>
        <div className="w-1/3">
          <p>Amount: {props.envelope.amount}</p>
        </div>
        <div className="w-1/3">
          <p>Total: {props.envelope.fill}</p>
        </div>
      </div>
    </div>

  )
}



<div className="max-w-sm w-full lg:max-w-full lg:flex">
  <div className="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
    <div className="mb-8">
    </div>
  </div>
</div>
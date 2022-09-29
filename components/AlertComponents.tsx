/* This example requires Tailwind CSS v2.0+ */

export function AlertFormList( { errorMessages }) {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">There was an error with your submission</h3>
          <div className="mt-2 text-sm text-red-700">
            <ul role="list" className="list-disc space-y-1 pl-5">
              {errorMessages.map(error => <li key={error.code}>{error.message}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
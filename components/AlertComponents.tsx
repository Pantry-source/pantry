//can't find tailwind module

export function AlertFormError() {
  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
            null value in column "name" of relation "products" violates not-null constraint
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* This example requires Tailwind CSS v2.0+ */

// export function AlertFormList() {
//   return (
//     <div className="rounded-md bg-red-50 p-4">
//       <div className="flex">
//         <div className="ml-3">
//           <h3 className="text-sm font-medium text-red-800">There were 2 errors with your submission</h3>
//           <div className="mt-2 text-sm text-red-700">
//             <ul role="list" className="list-disc space-y-1 pl-5">
//               <li>Your password must be at least 8 characters</li>
//               <li>Your password must include at least one pro wrestling finishing move</li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
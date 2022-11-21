import { useState } from 'react';
import { PlusIcon as PlusIconMini } from '@heroicons/react/20/solid'
import { PlusIcon as PlusIconOutline } from '@heroicons/react/24/outline'

function PillButton({ id, quantity, updateQuantity }) {
  const [amount, setAmount] = useState(quantity);

  function increment() {
    setAmount(amount => amount + 1);
    updateQuantity(id,amount)
  }

  function decrement() {
    setAmount(amount => amount - 1);
    updateQuantity(id, amount);
  }

  return (
    <div className='rounded-full' style={{ backgroundColor: 'transparent', border: 'solid' }}>
      <button
        onClick={decrement}
        type="button"
        className="h-5 w-5 inline-flex items-center rounded-full border border-transparent  p-5  shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        -
      </button>
      <button
        type="button"
        className="h-5 w-5 inline-flex items-center border-transparent  p-5  shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        1
      </button>
      <button
        onClick={increment}
        type="button"
        className="h-5 w-5 inline-flex items-center rounded-full border border-transparent  p-5  shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        +
      </button>
    </div>
  )
}

export default PillButton;
import { useState, useEffect } from 'react';

function PillButton({ id, quantity, unit, updateQuantity }) {

  function increment() {
    updateQuantity(id, quantity + 1.0);
  }

  function decrement() {
    updateQuantity(id, quantity - (quantity < 1.0 ? quantity : 1.0));
  }

  return (

    <div className='rounded-full' style={{ backgroundColor: 'transparent', border: '1px solid rgba(0, 0, 0, 0.05)', width: 'fit-content' }}>
      <button
        disabled={quantity ? false : true}
        onClick={decrement}
        type="button"
        name="decrement-button"
        className="h-5 w-5 hover:text-black inline-flex items-center rounded-full p-5 hover:font-bold focus:outline-none focus:ring-offset-2"
        style={{ justifyContent: 'center', fontSize: '1.2500em', paddingTop: '0'}}>
        {quantity ? '-' : ''}
      </button>
      <button
        type="button"
        name='default-number-dropdown'
        className="h-5 w-5 hover:text-black inline-flex items-center p-5 hover:font-bold focus:outline-none focus:ring-offset-2"
        style={{ justifyContent: 'center'}}>
        {quantity} {unit}
      </button>
      <button
        onClick={increment}
        type="button"
        name='increment-button'
        className="h-5 w-5 hover:text-black inline-flex items-center rounded-full p-5 hover:font-bold focus:outline-none focus:ring-offset-2"
        style={{ justifyContent: 'center', fontSize: '1.2500em' }}>
        +
      </button>
    </div>
  )
}

export default PillButton;
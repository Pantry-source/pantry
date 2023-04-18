
type PillButtonProps = {
  id: number;
  count: number;
  label: string;
  updateCount: (id: number, count: number) => void;
}


function PillButton({ id, count, label, updateCount }: PillButtonProps) {

  function increment() {
    updateCount(id, count + 1.0);
  }

  function decrement() {
    updateCount(id, count - (count < 1.0 ? count : 1.0));
  }

  return (

    <div className='rounded-full' style={{ backgroundColor: 'transparent', border: '1px solid rgba(0, 0, 0, 0.05)', width: 'fit-content' }}>
      <button
        disabled={count ? false : true}
        onClick={decrement}
        type="button"
        name="decrement-button"
        className="h-5 w-5 hover:text-black inline-flex items-center rounded-full p-5 hover:font-bold focus:outline-none focus:ring-offset-2"
        style={{ justifyContent: 'center', fontSize: '1.2500em', paddingTop: '0'}}>
        {count ? '-' : ''}
      </button>
      <button
        type="button"
        name='default-number-dropdown'
        className="h-5 w-5 hover:text-black inline-flex items-center p-5 hover:font-bold focus:outline-none focus:ring-offset-2"
        style={{ justifyContent: 'center'}}>
        {count} {label}
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
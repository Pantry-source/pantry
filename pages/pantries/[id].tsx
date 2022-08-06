import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ReactMarkdown from 'react-markdown'
import { supabase } from '../../api'
import ProductEditor from '../../components/ProductEditor';
import SlideOver from '../../components/SlideOverDialog';

export default function Pantry() {
  const [pantry, setPantry] = useState(null)
  const [isAddingProducts, setIsAddingProducts] = useState(false)
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    fetchPantry()
    async function fetchPantry() {
      if (!id) return
      const { data } = await supabase
        .from('pantries')
        .select(`
          *,
          products(name)
        `)
        .filter('id', 'eq', id)
        .single()
      setPantry(data)
    }
  }, [id])
  if (!pantry) return null;
  const { description, title, user_email } = pantry;
  function addProducts() {
    setIsAddingProducts(true);
  }
  return (
    <div>
      <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={addProducts}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto">
            Add Products
          </button>
        </div>
      </div>
      </div>
    {
      isAddingProducts ?
      <SlideOver 
        open={isAddingProducts} 
        onClose={() => setIsAddingProducts(false)} 
        title="New product"
        subtitle={`Fillout the information below to add a product to ${title}`}>
          <ProductEditor />
      </SlideOver> : null
    }
    </div>
  )
}

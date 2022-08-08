import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../api'
import ProductEditor from '../../components/ProductEditor';
import SlideOver from '../../components/SlideOverDialog';

export default function Pantry() {
  const [pantry, setPantry] = useState(null);
  const [categories, setCategories] = useState(null);
  const [units, setUnits] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({});
  const [isAddingProducts, setIsAddingProducts] = useState(false)
  function onProductChange(e) {
    // for boolean product attributes use "checked" property of input instead of "value" so that the value is boolean and not string
    const value = e.target.name === 'is_essential' ? e.target.checked : e.target.value;
    setCurrentProduct(() => ({ ...currentProduct, [e.target.name]: value }))
  }
  const router = useRouter()
  const { id } = router.query
  async function fetchPantry() {
    if (!id) return
    const { data } = await supabase
      .from('pantries')
      .select(`
        *,
        products(name)
      `)
      .filter('id', 'eq', id)
      .single();
    setPantry(data);
  }
  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select(`*`);
    setCategories(data);
  }
  async function fetchQuantityUnits() {
    const { data } = await supabase
      .from('quantity_units')
      .select(`*`);
    setUnits(data);
  }

  function saveCurrentProduct(e) {
    e.preventDefault();
    console.log(currentProduct);
  }

  useEffect(() => {
    fetchPantry();
    fetchCategories();
    fetchQuantityUnits();
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
      <SlideOver 
        open={isAddingProducts} 
        onClose={() => setIsAddingProducts(false)} 
        onSubmit={saveCurrentProduct}
        title="New product"
        subtitle={`Fillout the information below to add a product to ${title}`}>
          <ProductEditor 
            product={currentProduct}
            categories={categories} 
            units={units}
            onProductChange={onProductChange} />
      </SlideOver> 
    </div>
  )
}

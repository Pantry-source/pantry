import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../api'
import ProductEditor from '../../components/ProductEditor';
import SlideOver from '../../components/SlideOverDialog';

export default function Pantry() {
  const [pantry, setPantry] = useState(null);
  const [categories, setCategories] = useState(null);
  const [categoriesMap, setCategoriesMap] = useState(null);
  const [units, setUnits] = useState(null);
  const [unitsMap, setUnitsMap] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({});
  const [isAddingProducts, setIsAddingProducts] = useState(false)
  function onProductChange(e) {
    // for boolean product attributes use "checked" property of input instead of "value" so that the value is boolean and not string
    const value = e.target.name === 'is_essential' ? e.target.checked : e.target.value;
    console.log(e.target.name);
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
        products(*)
      `)
      .filter('id', 'eq', id)
      .single();
    setPantry(data);
    setCurrentProduct(() => ({ ...currentProduct, 'pantry_id': data.id }))
  }
  async function fetchCategories() {
    const { data } = await supabase
      .from('categories')
      .select(`*`);
    setCategories(data);
    setCategoriesMap(data?.reduce((previous, category) => {
      return {
        ...previous,
        [category.id]: category.name
      };
    }, {}));
  }
  async function fetchQuantityUnits() {
    const { data } = await supabase
      .from('quantity_units')
      .select(`*`);
    setUnits(data);
    setUnitsMap(data?.reduce((previous, category) => {
      return {
        ...previous,
        [category.id]: category.name
      };
    }, {}));
  }

  async function saveCurrentProduct(e) {
    e.preventDefault();
    console.log(currentProduct);
    const { data } = await supabase
      .from('products')
      .insert([currentProduct]);
    console.log(data);
  }

  useEffect(() => {
    fetchPantry();
    fetchCategories();
    fetchQuantityUnits();
  }, [id])
  if (!pantry) return null;
  const { description, title, products } = pantry;
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
        <table className="min-w-full divide-y divide-gray-300">
          <thead>
            <tr>
              <th
                scope="col"
                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
              >
                Product
              </th>
              <th
                scope="col"
                className="hidden py-3.5 px-3 text-right text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Is essential
              </th>
              <th
                scope="col"
                className="hidden py-3.5 px-3 text-right text-sm font-semibold text-gray-900 sm:table-cell"
              >
                Expires
              </th>
              <th
                scope="col"
                className="py-3.5 pl-3 pr-4 text-right text-sm font-semibold text-gray-900 sm:pr-6 md:pr-0"
              >
                Vendor
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-200">
                <td className="py-4 pl-4 pr-3 text-sm sm:pl-6 md:pl-0">
                  <div className="font-medium text-gray-900">{product.name}</div>
                  <div className="mt-0.5 text-gray-500">
                    {product.quantity_amount} {unitsMap && unitsMap[product.quantity_unit]}
                  </div>
                </td>
                <td className="hidden py-4 px-3 text-right text-sm text-gray-500 sm:table-cell">{ product.is_essential ? 'yes' : 'no' }</td>
                <td className="hidden py-4 px-3 text-right text-sm text-gray-500 sm:table-cell">{ product.expires_at || 'not specified' }</td>
                <td className="hidden py-4 px-3 text-right text-sm text-gray-500 sm:table-cell">{product.vendor || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

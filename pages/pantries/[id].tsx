import { useEffect, useState, Fragment, useLayoutEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../api';
import ProductEditor from '../../components/ProductEditor';
import SlideOver from '../../components/SlideOverDialog';
import Filter from '../../components/Filter';

export default function Pantry() {
  const [pantry, setPantry] = useState(null);
  const [categories, setCategories] = useState(null);
  const [units, setUnits] = useState(null);
  const [unitsMap, setUnitsMap] = useState(null);
  const [currentProduct, setCurrentProduct] = useState({});
  const [isAddingProducts, setIsAddingProducts] = useState(false);
  const [errorMessages, setErrorMessages] = useState([]);
  const [isPantryLoading, setIsPantryLoading] = useState(true);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [isUnitMapLoading, setIsUnitMapLoading] = useState(true);
  const [createdCategory, setCreatedCategory] = useState(null);

  const checkbox = useRef()
  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState([])

  function onProductChange(e) {
    // for boolean product attributes use "checked" property of input instead of "value" so that the value is boolean and not string
    const value = e.target.name === 'is_essential' ? e.target.checked : e.target.value;
    setCurrentProduct(() => ({
      ...currentProduct,
      [e.target.name]: value === '' ? null : value
    }));
  }

  /** adds selected Category id to currentProduct */
  function onCategoryChange(id) {
    setCurrentProduct(() => ({
      ...currentProduct,
      'category_id': id
    }));
  }

  const router = useRouter();
  const { id } = router.query;

  async function fetchPantry() {
    if (id) {
      setIsPantryLoading(true);
      const response = await supabase
      .from('pantries')
      .select(`*, products(*)`)
      .filter('id', 'eq', id)
      .single();
      const { error, data } = response;
      if (!error) {
        setPantry(data);
        setCurrentProduct(() => ({ ...currentProduct, 'pantry_id': data.id }));
        setIsPantryLoading(false);
      }
      return response;
    }
  }

  async function fetchCategories() {
    setIsCategoriesLoading(true);
    const response = await supabase
      .from('categories')
      .select(`*`);
    const { error, data } = response;
    if (!error && data) {
      setCategories(data);
      setIsCategoriesLoading(false);
    }
    return response;
  }

  async function fetchQuantityUnits() {
    setIsUnitMapLoading(true);
    const response = await supabase
      .from('quantity_units')
      .select(`*`);
    const { error, data } = response;
    if (!error && data) {
      setUnits(data);
      setUnitsMap(data.reduce((previous, category) => {
        return {
          ...previous,
          [category.id]: category.name
        };
      }, {}));
      setIsUnitMapLoading(false);
    }
    return response;
  }

  // async function fetchCategoryId() {
  //   cl('createdCategory', createdCategory)
  //   const { data, error } = await supabase
  //     .from('categories')
  //     .select('*')
  //     .eq('name', createdCategory)
  //     .single()
  //   try {
  //     if (error) throw new Error('no category id data')
  //   } catch (error) {
  //     console.log(error);
  //   }
  //   return data
  // }

  /** Receives selected option(category object) from Combobox
   * if category id === false, fetch id for newly created category
    */
  async function onCategorySelect(category) {
    if (category.id) {
      onCategoryChange(category.id);
    }
  }

  async function selectProduct(product) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('name', product.name)
      .single();
    setCurrentProduct(data);
    setIsAddingProducts(true);
  }

  async function updateProduct() {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: currentProduct.name,
        quantity_amount: currentProduct.quantity_amount,
        is_essential: currentProduct.is_essential,
        quantity_unit: currentProduct.quantity_unit,
        vendor: currentProduct.vendor,
        category_id: currentProduct.category_id
      })
      .eq('id', currentProduct.id)
    if (error) {
      setErrorMessages(errorMessages => [...errorMessages, error]);
    } else {
      setIsAddingProducts(false);
      fetchPantry();
    }
  }

  async function createProduct() {
    const { data, error } = await supabase
      .from('products')
      .insert([currentProduct]);
    if (error) {
      setErrorMessages(errorMessages => [...errorMessages, error]);
    } else {
      setIsAddingProducts(false);
      fetchPantry();
    }
  }

  /** removes selected product(s) from database and rerenders updated category list */
  async function deleteProduct() {
    for (let product of selectedProduct) {
      const { data, error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)
        .single();

        setSelectedProduct(products => [])
      }
      fetchPantry();
  }

  async function createCategory(category) {
    const response = await supabase
      .from('categories')
      .insert([
        { user_id: pantry.user_id, name: category },
      ])
      .single();
    const { data, error } = response;
    if (error) {
      setErrorMessages(errorMessages => [...errorMessages, error])
    } else {
      fetchCategories();
    }
    onCategoryChange(data.id)
    return data
  }

  function addProducts() {
    setCurrentProduct(() => ({ 'pantry_id': pantry.id, "is_essential": false }));
    setIsAddingProducts(true);
  }

  function toggleAll() {
    setSelectedProduct(checked || indeterminate ? [] : pantry.products)
    setChecked(!checked && !indeterminate)
    setIndeterminate(false)
  }

  function onSubmitProduct(e) {
    e.preventDefault();
    setErrorMessages([]);
    currentProduct.id ? updateProduct() : createProduct();
  }

  function onCloseProductForm() {
    setIsAddingProducts(false);
    setErrorMessages([])
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  useEffect(() => {
    fetchPantry();
    fetchCategories();
    fetchQuantityUnits();
  }, [id])

  if (isPantryLoading || isCategoriesLoading || isUnitMapLoading) {
    return <h1>loading...</h1>;
  }

  const { description, products, title } = pantry;
  const categoriesWithProducts = categories.reduce((previous, category) => {
    const productsInCategory = products.filter(p => p.category_id === category.id);
    if (productsInCategory.length) {
      previous.push({
        ...category,
        products: productsInCategory
      });
    }
    return previous;
  }, []);

  return (
    <div>
      <div>
        <div className="flex items-top mb-6">
          <div className="flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
            <p className="mt-2 text-sm text-gray-700">{description}</p>
          </div>
          <div className="mt-4 mt-0 ml-16 flex-none">
            <button
              type="button"
              onClick={addProducts}
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto">
              Add Products
            </button>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="relative overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <div className="relative w-12 px-6 sm:w-16 sm:px-8" style={{ top: "1.5625em" }}> {/* 25px */}
                  <input
                    type="checkbox"
                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                    ref={checkbox}
                    checked={checked}
                    onChange={toggleAll} />
                </div>
                {selectedProduct.length > 0 && (
                  <div className="absolute top-0 left-12 flex h-12 items-center space-x-3  sm:left-16">
                    <button
                      type="button"
                      className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30">
                      Out Of Stock
                    </button>
                    <button
                      type="button"
                      onClick={deleteProduct}
                      className="inline-flex items-center rounded border border-gray-300 bg-white px-2.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30">
                      {pantry.products.length === selectedProduct.length ? "Delete all" : "Delete"}
                    </button>
                  </div>
                )}
                <Filter validCategories={categoriesWithProducts} />
                <table className="min-w-full">
                  <thead className="bg-white">
                    <tr>
                      <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
                      </th>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Is Essential
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Expires
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Vendor
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {categoriesWithProducts.map((category, productIdx) => (
                      category.products &&
                      <Fragment key={category.name}>
                        <tr className="border-t border-gray-200">
                          <td className='bg-gray-50'></td>
                          <th
                            colSpan={5}
                            scope="colgroup"
                            className="bg-gray-50 px-4 py-2 text-left text-sm font-semibold text-gray-900 sm:px-6">
                            {category.name}
                          </th>
                        </tr>
                        {category.products.map((product) => (
                          <tr
                            key={product.name}
                            className={classNames(productIdx === 0 ? 'border-gray-300' : 'border-gray-200', 'border-t')}>
                            <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                              {selectedProduct.includes(product) && (
                                <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                              )}
                              <input
                                type="checkbox"
                                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 sm:left-6"
                                value={product.name}
                                checked={selectedProduct.includes(product)}
                                onChange={(e) =>
                                  setSelectedProduct(
                                    e.target.checked
                                      ? [...selectedProduct, product]
                                      : selectedProduct.filter((p) => p !== product)
                                  )
                                }
                              />
                            </td>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {product.name}
                              <div className="mt-0.5 text-gray-500">
                                {product.quantity_amount} {unitsMap && unitsMap[product.quantity_unit]}
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.is_essential ? 'yes' : 'no'}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.expires_at || 'not specified'}</td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{product.vendor || ''}</td>
                            <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                              <button
                                type="button"
                                onClick={() => selectProduct(product)}
                                className="text-indigo-600 hover:text-indigo-900">
                                Edit<span className="sr-only">,{product.name}</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SlideOver
        isExistingProduct={currentProduct.id}
        open={isAddingProducts}
        onClose={onCloseProductForm}
        onSubmit={(e) => onSubmitProduct(e)}
        title="New product"
        subtitle={`Fillout the information below to add a product to ${title}`}>
        <ProductEditor
          userId={pantry.user_id}
          createCategory={createCategory}
          onCategorySelect={onCategorySelect}
          product={currentProduct}
          categories={categories}
          units={units}
          onProductChange={onProductChange}
          errorMessages={errorMessages}
        />
      </SlideOver>
    </div>
  )
}
